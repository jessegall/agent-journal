<?php

declare(strict_types=1);

namespace App\Processes\Data;

use App\Processes\Models\ClassificationRule;
use Spatie\LaravelData\Data;

/**
 * One classification rule of the project in the review list, active or retired, at its active revision.
 */
final class RuleRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $ruleId,
        public readonly string $owner,
        public readonly int $revision,
        public readonly string $state,
        public readonly string $reason,
    ) {}

    public static function fromRule(ClassificationRule $rule): self
    {
        return new self(
            $rule->id,
            $rule->rule_id,
            $rule->scope->name(),
            $rule->active_revision,
            $rule->state->value,
            $rule->state_reason,
        );
    }
}
