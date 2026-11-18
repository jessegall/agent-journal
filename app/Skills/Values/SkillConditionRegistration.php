<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Skills\Contracts\SkillCondition;
use Spatie\LaravelData\Data;

/**
 * A named condition type a domain or module supplies: its owner-prefixed key, schema version, the Data class of its
 * parameters and the class that evaluates it.
 */
final readonly class SkillConditionRegistration
{
    /**
     * @param  class-string<Data>  $parameters
     * @param  class-string<SkillCondition>  $evaluator
     */
    public function __construct(
        public string $key,
        public int $version,
        public string $parameters,
        public string $evaluator,
    ) {}
}
