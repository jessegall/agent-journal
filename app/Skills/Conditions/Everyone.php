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
    public const string TYPE = 'everyone';

    public const int VERSION = 1;

    public function evaluate(SkillContext $context): ConditionResult
    {
        return ConditionResult::match('everyone');
    }

    public function toArray(): array
    {
        return ['type' => self::TYPE, 'version' => self::VERSION];
    }
}
