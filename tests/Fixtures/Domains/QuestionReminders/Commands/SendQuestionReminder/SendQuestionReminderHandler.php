<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder;

use App\Contracts\ServerClock;
use App\Contracts\CommandHandler;
use App\Support\EngineStacks;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;
use Tests\Fixtures\Domains\QuestionReminders\Models\Question;

/**
 * Locks the question and rechecks it: a waiting one is reminded once; an answered one sends nothing and its frame
 * leaves the stack in this same command, subject before stack.
 */
final readonly class SendQuestionReminderHandler implements CommandHandler
{
    public function __construct(
        private ServerClock $clock,
        private EngineStacks $stacks,
    ) {}

    public function handle(SendQuestionReminderCommand $command): void
    {
        $question = Question::lockedById($command->questionId);

        if ($question->answered) {
            $this->stacks->popExposed($command->target);

            return;
        }

        if ($question->isWaiting()) {
            $question->remindAt($this->clock->now());
        }
    }
}
