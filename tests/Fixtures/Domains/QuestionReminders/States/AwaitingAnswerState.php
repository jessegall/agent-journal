<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Hooks\Contracts\TickableState;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;

/**
 * An agent waits for the answer to its question. Once it waited long enough the tick asks for one reminder; the
 * reminder's handler rechecks the question under its lock, so a second tick or a late answer sends nothing more.
 */
final class AwaitingAnswerState extends AgentState implements TickableState
{
    public const int REMIND_AFTER_SECONDS = 60;

    public function __construct(
        private readonly string $questionId,
        private readonly bool $settled,
    ) {}

    public function isFinished(): bool
    {
        return $this->settled;
    }

    public function onTick(TickContext $tick): TickCommands
    {
        if ($tick->enteredAt->diffInSeconds($tick->now) < self::REMIND_AFTER_SECONDS) {
            return TickCommands::none();
        }

        return TickCommands::of(new SendQuestionReminderCommand($tick->target, $this->questionId));
    }
}
