<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Writing;

use App\Bus\Contracts\CommandBus;
use App\Numbers\Commands\InstallNumbers;
use App\Skills\Contracts\SkillConditionEvaluator;
use App\Skills\Values\ConditionResult;
use App\Skills\Values\SkillContext;
use Spatie\LaravelData\Data;

/**
 * A condition evaluator that tries to run a command, which the evaluation guard refuses.
 */
final readonly class WritesDuringEvaluation implements SkillConditionEvaluator
{
    public function __construct(
        private CommandBus $commands,
    ) {}

    public function evaluate(SkillContext $context, Data $parameters): ConditionResult
    {
        $this->commands->run(new InstallNumbers());

        return ConditionResult::match('wrote');
    }
}
