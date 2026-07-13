-- Run AFTER creating Orders@pointtaken.co.za via Supabase Dashboard -> Authentication -> Add user.
-- Replace <ORDERS_USER_ID> below with the UID shown for that user in the Users list.

insert into public.profiles (id, full_name, role)
values ('<ORDERS_USER_ID>', 'Orders', 'admin')
on conflict (id) do update set role = 'admin';
