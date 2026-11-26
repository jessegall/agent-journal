<?php

declare(strict_types=1);

namespace Tests\Fixtures\Skills\Writing;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Records\Commands\InstallNumbers\InstallNumbersCommand;
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
        private JournalCommands $dispatchers,
    ) {}

    public function evaluate(SkillContext $context, Data $parameters): ConditionResult
    {
        $this->dispatchers->runAsJournal(CommandEntry::HostControl, 'number install', new InstallNumbersCommand());

        return ConditionResult::match('wrote');
    }
}
