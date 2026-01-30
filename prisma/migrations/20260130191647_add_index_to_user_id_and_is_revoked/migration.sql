-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_is_revoked_idx" ON "refresh_tokens"("user_id", "is_revoked");
