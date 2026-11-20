<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Enums\ConditionOutcome;

/**
 * A condition's answer for one context, with a reason code safe to show anyone who may preview the skill.
 */
final readonly class ConditionResult
{
    private function __construct(
        public ConditionOutcome $outcome,
        public string $reason,
    ) {}

    public static function match(string $reason): self
    {
        return new self(ConditionOutcome::Match, $reason);
    }

    public static function noMatch(string $reason): self
    {
        return new self(ConditionOutcome::NoMatch, $reason);
    }

    public static function unavailable(string $reason): self
    {
        return new self(ConditionOutcome::Unavailable, $reason);
    }

    /**
     * The first of these results with this outcome, or null when none has it.
     *
     * @param  list<self>  $evaluations
     */
    public static function firstWith(ConditionOutcome $outcome, array $evaluations): self|null
    {
        foreach ($evaluations as $evaluation) {
            if ($evaluation->outcome === $outcome) {
                return $evaluation;
            }
        }

        return null;
    }

    public function isMatch(): bool
    {
        return $this->outcome === ConditionOutcome::Match;
    }
}
