<?php

declare(strict_types=1);

namespace Domain\Reminders\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use Domain\Reminders\Enums\ReminderStatus;
use RuntimeException;

/**
 * The reminder is done or cancelled already, so it cannot be finished again.
 */
final class ReminderEnded extends RuntimeException implements CommandRefusal
{
    public static function as(string $reminderId, ReminderStatus $status): self
    {
        return new self("Reminder {$reminderId} is {$status->value} already.");
    }
}
