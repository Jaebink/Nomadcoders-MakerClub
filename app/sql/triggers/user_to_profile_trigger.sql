DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS user_to_profile_trigger ON auth.users;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF new.raw_app_meta_data IS NOT NULL THEN

        IF new.raw_app_meta_data ? 'provider' AND (new.raw_app_meta_data ->> 'provider' = 'email' OR new.raw_app_meta_data ->> 'provider' = 'phone') THEN
            IF new.raw_user_meta_data ? 'name' AND new.raw_user_meta_data ? 'username' THEN
                INSERT INTO public.profiles (profile_id, name, username)
                VALUES (
                    new.id,
                    new.raw_user_meta_data ->> 'name',
                    new.raw_user_meta_data ->> 'username'
                );
            ELSE
                INSERT INTO public.profiles (profile_id, name, username)
                VALUES (
                    new.id,
                    'Anonymous',
                    'mr.' || substr(md5(random()::text), 1, 8)
                );
            END IF;
        END IF;

        IF new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'github' THEN
            INSERT INTO public.profiles (profile_id, name, username)
            VALUES (
                new.id,
                new.raw_user_meta_data ->> 'full_name',
                new.raw_user_meta_data ->> 'user_name'
            );
        END IF;

        IF new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'kakao' THEN
            INSERT INTO public.profiles (profile_id, name, username)
            VALUES (
                new.id,
                new.raw_user_meta_data ->> 'name',
                new.raw_user_meta_data ->> 'preferred_username'
            );
        END IF;

    END IF;
    RETURN new;
END;
$$;

CREATE TRIGGER user_to_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();