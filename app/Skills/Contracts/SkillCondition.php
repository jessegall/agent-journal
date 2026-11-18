<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Decides whether a skill applies to one context: a match, no match, or unavailable when a fact it needs is missing.
 */
interface SkillCondition
{
    public function evaluate(SkillContext $context): ConditionResult;
}
