<?php

declare(strict_types=1);

namespace Domain\Helpers\Support\Readers;

use App\Enums\LaunchCandidateRank;
use Domain\Helpers\Models\HelperIdentity;

/**
 * One of the parent's helpers that may take the work, with its rank and the reasons a receipt states: why this
 * helper, whether its conversation resumes or starts anew, and whether an exposure check ran.
 */
final readonly class HelperCandidate
{
    public function __construct(
        public HelperIdentity $identity,
        public LaunchCandidateRank $rank,
        public bool $resumesConversation,
        public bool $isExposureChecked,
    ) {}

    /**
     * The reason text for the receipt.
     */
    public function reason(): string
    {
        $conversation = $this->resumesConversation
            ? 'It resumes its conversation.'
            : 'It starts a new conversation.';

        $exposure = $this->isExposureChecked
            ? ' Nothing it saw before touches this subject.'
            : '';

        return sprintf('%s %s%s', $this->rank->reason(), $conversation, $exposure);
    }
}
