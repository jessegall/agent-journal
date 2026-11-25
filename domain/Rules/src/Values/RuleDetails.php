<?php

declare(strict_types=1);

namespace Domain\Rules\Values;

use App\Enums\Assignments\ActorType;
use Domain\Rules\Enums\RuleState;

/**
 * One rule as its read gives it: its text and state, and for a proposal its reason, its proposer and the number of
 * the rule it would replace; a rule nobody proposed has none of those.
 */
final readonly class RuleDetails
{
    public function __construct(
        public string $id,
        public int $number,
        public string $text,
        public RuleState $state,
        public string|null $reason,
        public ActorType|null $proposerType,
        public string|null $proposerId,
        public int|null $replacesRuleNumber,
    ) {}
}
