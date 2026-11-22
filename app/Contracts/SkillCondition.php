<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\ConditionResult;
use App\Values\SkillContext;

/**
 * Decides whether a skill applies to one context: a match, no match, or unavailable when a fact it needs is missing.
 * Each condition writes itself in the JSON wire format, so code and stored conditions pass one validator.
 */
interface SkillCondition
{
    public function evaluate(SkillContext $context): ConditionResult;

    /**
     * The condition in the wire format: type, version and its children, keys or parameters.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
