-- Run in Supabase Dashboard -> SQL Editor
-- Shows whether Orders@pointtaken.co.za / orders.ptg1@gmail.com already exist as logins,
-- and their current admin role. Passwords are hashed and cannot be retrieved by SQL --
-- use the Dashboard's Authentication -> Users -> [user] -> "Reset password" / set-password
-- action instead if you need to (re)set one.

select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  p.role
from auth.users u
left join public.profiles p on p.id = u.id
where u.email in ('Orders@pointtaken.co.za', 'orders.ptg1@gmail.com');
