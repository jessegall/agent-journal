<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * Where a task stands: open until an agent starts it, then started, blocked, finished or cancelled.
 */
enum TaskState: string
{
    case Open = 'open';
    case Started = 'started';
    case Blocked = 'blocked';
    case Finished = 'finished';
    case Cancelled = 'cancelled';

    /**
     * What the stack sees of the current run in this state.
     */
    public function workState(): TaskWorkState
    {
        return match ($this) {
            self::Started => TaskWorkState::Active,
            self::Blocked => TaskWorkState::Blocked,
            self::Open, self::Finished => TaskWorkState::Finished,
            self::Cancelled => TaskWorkState::Cancelled,
        };
    }

    /**
     * Whether the task's work is over: finished or cancelled.
     */
    public function hasEnded(): bool
    {
        return $this === self::Finished || $this === self::Cancelled;
    }

    /**
     * The states whose work is not over: every state that has not ended.
     *
     * @return list<self>
     */
    public static function unfinished(): array
    {
        return array_values(array_filter(self::cases(), fn (self $state) => ! $state->hasEnded()));
    }
}
