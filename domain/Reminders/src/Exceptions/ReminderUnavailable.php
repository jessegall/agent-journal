<?php

declare(strict_types=1);

namespace Domain\Reminders\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * The reminder does not exist, or it is another actor's.
 */
final class ReminderUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forId(string $reminderId): self
    {
        return new self("Reminder {$reminderId} does not exist, or it is not yours.");
    }
}
