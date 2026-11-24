<?php

declare(strict_types=1);

namespace Domain\Reminders\Events;

/**
 * A reminder finished.
 */
final readonly class ReminderFinished extends ReminderEvent
{
    public function __construct(
        public string $reminderId,
    ) {}
}
