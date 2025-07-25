ALTER POLICY "letter-response-select-policy" ON "letter_responses" TO authenticated USING ((select auth.uid()) = "letter_responses"."responder_id" OR EXISTS (
            SELECT 1
            FROM concern_letters
            WHERE concern_letters.letter_id = "letter_responses"."letter_id"
            AND concern_letters.sender_id = (select auth.uid())
        ));