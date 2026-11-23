<?php

declare(strict_types=1);

namespace Domain\Reminders\Enums;

/**
 * Where a reminder stands: still waiting for its time, done, or given up.
 */
enum ReminderStatus: string
{
    case Open = 'open';
    case Done = 'done';
    case Cancelled = 'cancelled';

    /**
     * The word the reminders window shows for it.
     */
    public function label(): string
    {
        return ucfirst($this->value);
    }

    public function isWaiting(): bool
    {
        return $this === self::Open;
    }
}
