<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\SkillConditionEvaluator;
use Spatie\LaravelData\Data;

/**
 * A named condition type a domain or module supplies: its owner-prefixed key, such as plans.active-plan, the schema
 * version of its parameters, the Data class they are read into and the class that evaluates it.
 */
final readonly class SkillConditionDefinition
{
    /**
     * @param  class-string<Data>  $parameters
     * @param  class-string<SkillConditionEvaluator>  $evaluator
     */
    public function __construct(
        public string $key,
        public int $version,
        public string $parameters,
        public string $evaluator,
    ) {}
}
