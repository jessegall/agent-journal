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
     * Whether the task's work is over: finished or cancelled.
     */
    public function hasEnded(): bool
    {
        return match ($this) {
            self::Finished, self::Cancelled => true,
            self::Open, self::Started, self::Blocked => false,
        };
    }

    /**
     * Whether a task in this state holds its phase's checks back: open or started, not blocked or ended.
     */
    public function isHoldingChecks(): bool
    {
        return match ($this) {
            self::Open, self::Started => true,
            self::Blocked, self::Finished, self::Cancelled => false,
        };
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
