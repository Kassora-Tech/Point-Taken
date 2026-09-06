import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const MAINTENANCE_BYPASS_COOKIE = 'maintenance_bypass'
const MAINTENANCE_BYPASS_MAX_AGE = 60 * 60 * 24 // 24 hours

// Paths that must keep working even while MAINTENANCE_MODE is on: the
// maintenance page itself (avoids a rewrite loop), API routes (webhooks,
// cron jobs, backend functionality), and static/build assets.
function isMaintenanceExempt(pathname: string) {
  return (
    pathname === '/maintenance' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|woff2?|ttf)$/.test(pathname)
  )
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Maintenance mode must be fully independent of Supabase: every path here
  // (exempt, bypassed, or rewritten to /maintenance) returns before
  // createServerClient is ever called, so a misconfigured Supabase project
  // can't take down the maintenance page. Trade-off: bypass sessions do not
  // get the dashboard-auth enforcement below, since that logic never runs
  // for them while MAINTENANCE_MODE is on.
  if (process.env.MAINTENANCE_MODE === 'true') {
    if (isMaintenanceExempt(pathname)) {
      return NextResponse.next()
    }

    const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET
    const bypassParam = request.nextUrl.searchParams.get('bypass')
    const bypassCookie = request.cookies.get(MAINTENANCE_BYPASS_COOKIE)?.value
    const isBypassed =
      !!bypassSecret && (bypassCookie === bypassSecret || bypassParam === bypassSecret)

    if (!isBypassed) {
      const maintenanceUrl = request.nextUrl.clone()
      maintenanceUrl.pathname = '/maintenance'
      maintenanceUrl.search = ''
      return NextResponse.rewrite(maintenanceUrl, {
        status: 503,
        headers: { 'Retry-After': '3600' },
      })
    }

    // Persist a fresh ?bypass= param as a cookie so subsequent requests
    // (which won't carry the query param) stay bypassed.
    const response = NextResponse.next()
    if (bypassParam === bypassSecret && bypassCookie !== bypassSecret) {
      response.cookies.set(MAINTENANCE_BYPASS_COOKIE, bypassSecret!, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: MAINTENANCE_BYPASS_MAX_AGE,
      })
    }
    return response
  }

  // Everything below only runs when MAINTENANCE_MODE is off — Supabase
  // config is never required for the maintenance path itself.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // All dashboard-protected routes (route group (dashboard) is invisible in URLs)
  const dashboardPaths = ['/dashboard', '/blog-admin', '/calendar', '/directory-admin', '/documents', '/reports', '/social', '/store-admin', '/tracking']
  const isDashboardRoute = dashboardPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const isAuthRoute = pathname.startsWith('/auth')

  // Protect dashboard routes - redirect unauthenticated users to login
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages (except callback)
  if (isAuthRoute && user && !pathname.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
