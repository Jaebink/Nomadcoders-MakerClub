CREATE OR REPLACE FUNCTION get_random_active_users(
  num_limit INT DEFAULT 5,
  sender_id UUID DEFAULT NULL,
  target_channel_id BIGINT DEFAULT NULL
)
RETURNS TABLE (id UUID, username TEXT)
LANGUAGE plpgsql
SECURITY INVOKER  -- 명시적으로 지정해도 되고, 기본값이므로 생략해도 됩니다.
AS $$
BEGIN
  RETURN QUERY
  SELECT profiles.profile_id AS id, profiles.username AS username
  FROM profiles
  WHERE profiles.is_active = TRUE
    AND (sender_id IS NULL OR profiles.profile_id <> sender_id)
    AND (
      target_channel_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM user_channels
        WHERE user_channels.user_id = profiles.profile_id
          AND user_channels.channel_id = target_channel_id
      )
    )
  ORDER BY RANDOM()
  LIMIT num_limit;
END;
$$;