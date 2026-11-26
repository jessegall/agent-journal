<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Contracts\Work\TickableState;
use App\Engine\Ticks\TickContext;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Attributes\Ticks;
use App\Support\Ticks\TickCommands;
use Tests\Fixtures\Domains\QuestionReminders\Commands\SendQuestionReminder\SendQuestionReminderCommand;
use Tests\Fixtures\Domains\QuestionReminders\Events\QuestionAnswered;

/**
 * An agent waits for the answer to its question. Once it waited long enough the tick asks for one reminder; the
 * reminder's handler rechecks the question under its lock, so a second tick or a late answer sends nothing more.
 */
#[StateType(AwaitAnswerStateReference::class, schemaVersion: 1)]
#[Ticks(guard: AwaitAnswerGuard::class)]
final class AwaitAnswerState extends AgentState implements TickableState
{
    public const int REMIND_AFTER_SECONDS = 60;

    private bool $isSettled = false;

    public function __construct(private readonly string $questionId) {}

    public function isFinished(): bool
    {
        return $this->isSettled;
    }

    public function onTick(TickContext $tick): TickCommands
    {
        if ($tick->enteredAt->diffInSeconds($tick->now) < self::REMIND_AFTER_SECONDS) {
            return TickCommands::none();
        }

        return TickCommands::of(new SendQuestionReminderCommand($tick->target, $this->questionId));
    }

    // ----------[ Events ]----------

    public function onQuestionAnswered(QuestionAnswered $event): void
    {
        if ($event->questionId === $this->questionId) {
            $this->isSettled = true;
        }
    }
}
