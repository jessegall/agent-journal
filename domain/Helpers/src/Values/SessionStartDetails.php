<?php

declare(strict_types=1);

namespace Domain\Helpers\Values;

use App\Agents\Enums\ConversationModeType;

/**
 * How a dispatch started one job, kept with the job so its receipt reads the same after a parent restart: the
 * request and the fingerprint of what it asked, the profile revision, whether the identity was new, whether the work
 * had to be independent, and the conversation it asked for with the reason.
 */
final readonly class SessionStartDetails
{
    public function __construct(
        public string $requestId,
        public string $payloadDigest,
        public int $profileRevision,
        public bool $isNewIdentity,
        public bool $isIndependent,
        public ConversationModeType $conversationMode,
        public string $conversationReason,
    ) {}
}
