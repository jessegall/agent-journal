<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;

/**
 * Every context within the authorized scope matches.
 */
final readonly class Everyone implements SkillCondition
{
    public function evaluate(SkillContext $context): ConditionResult
    {
        return ConditionResult::match('everyone');
    }
}
