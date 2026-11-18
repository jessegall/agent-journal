<?php

declare(strict_types=1);

namespace App\Skills\Conditions;

use App\Skills\Contracts\SkillCondition;
use App\Skills\Contracts\SkillConditionEvaluator;
use App\Skills\Support\EvaluationGuard;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Spatie\LaravelData\Data;
use Throwable;

/**
 * A named condition whose owner is installed: its evaluator answers inside the evaluation guard, so no command runs
 * meanwhile, and an evaluator that fails is reported and answers unavailable, never a match.
 */
final readonly class RegisteredCondition implements SkillCondition
{
    /**
     * @param  array<string, mixed>  $wireParameters  the parameters as written, kept for writing the condition back
     */
    public function __construct(
        public string $key,
        public int $version,
        private array $wireParameters,
        private Data $parameters,
        private SkillConditionEvaluator $evaluator,
        private EvaluationGuard $guard,
        private ExceptionHandler $failures,
    ) {}

    public function evaluate(SkillContext $context): ConditionResult
    {
        try {
            return $this->guard->during(fn () => $this->evaluator->evaluate($context, $this->parameters));
        } catch (Throwable $failure) {
            $this->failures->report($failure);

            return ConditionResult::unavailable('condition-failed');
        }
    }

    public function toArray(): array
    {
        return ['type' => Named::TYPE, 'version' => $this->version, 'key' => $this->key, 'parameters' => $this->wireParameters];
    }
}
