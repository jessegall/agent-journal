<?php

declare(strict_types=1);

namespace App\Skills\Contracts;

use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;
use Spatie\LaravelData\Data;

/**
 * Answers a named condition type a domain or module registered: it reads the facts it needs through its owner's own
 * readers and writes nothing.
 */
interface SkillConditionEvaluator
{
    /**
     * Whether a condition of this type, with its parameters, holds for the context.
     */
    public function evaluate(SkillContext $context, Data $parameters): ConditionResult;
}
