<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reminders\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Tests\Fixtures\Domains\Reminders\Commands\SendQuestionReminder;
use Tests\Fixtures\Domains\Reminders\Models\Question;

/**
 * Locks the question and rechecks it: a waiting one is reminded once; an answered one sends nothing and its frame
 * leaves the stack in this same command, subject before stack.
 */
final readonly class SendQuestionReminderHandler implements CommandHandler
{
    public function __construct(
        private ServerClock $clock,
        private StackCleanup $stacks,
    ) {}

    public function handle(SendQuestionReminder $command): void
    {
        $question = Question::lockedById($command->questionId);

        if ($question->answered) {
            $this->stacks->removeFinished($command->target);

            return;
        }

        if ($question->isWaiting()) {
            $question->remindAt($this->clock->now());
        }
    }
}
