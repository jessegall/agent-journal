<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Reviews\MergeAttemptState;
use App\Enums\Reviews\MergeRefusalReason;

/**
 * How a merge of approved work ended: merged with the resulting commit, refused with its reason and evidence, or
 * uncertain; it names the attempt, the reviewed head and the target as it was before.
 */
final readonly class MergeOutcome
{
    public function __construct(
        public string $attemptId,
        public MergeAttemptState $state,
        public string $head,
        public string|null $targetBefore,
        public string|null $result,
        public MergeRefusalReason|null $refusal,
        public string|null $evidence,
    ) {}
}
