<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Agents\Enums\ConversationModeType;

/**
 * What a dispatch chose for the helper it launches: whether the identity is new, whether its conversation resumes
 * or starts anew, and the reason its receipt states.
 */
final readonly class ConversationChoice
{
    public function __construct(
        public bool $isNewIdentity,
        public ConversationModeType $mode,
        public string $reason,
    ) {}

    /**
     * The choice for one of the parent's helpers that may take the work: it resumes only where its ranking says so.
     */
    public static function reusing(HelperCandidate $candidate): self
    {
        return new self(
            false,
            $candidate->resumesConversation ? ConversationModeType::Resume : ConversationModeType::New,
            $candidate->reason(),
        );
    }
}
