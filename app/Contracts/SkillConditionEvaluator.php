<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\ConditionResult;
use App\Values\SkillContext;
use Spatie\LaravelData\Data;

/**
 * Answers a named condition type a domain or module registered: it reads the facts it needs through its owner's own
 * readers and writes nothing.
 */
interface SkillConditionEvaluator
{
    public function evaluate(SkillContext $context, Data $parameters): ConditionResult;
}
