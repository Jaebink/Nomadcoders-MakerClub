CREATE OR REPLACE VIEW active_receivers WITH (security_invoker = on) AS
SELECT
    -- 어떤 편지에 속한 receiver인지 알기 위해 편지의 id를 포함하면 좋습니다.
    concern_letters.letter_id,
    concern_letters.created_at,
    -- jsonb 배열을 풀어서 나온 각 receiver 객체의 정보를 컬럼으로 만듭니다.
    (receiver->>'user_id')::uuid AS user_id,
    (receiver->>'seen')::boolean AS seen,
    (receiver->>'seen_at')::timestamptz AS seen_at
    FROM
    concern_letters,
    jsonb_array_elements(concern_letters.receivers) AS receiver
    WHERE
    -- is_active가 true인 receiver만 필터링합니다.
    (receiver->>'is_active')::boolean = true;