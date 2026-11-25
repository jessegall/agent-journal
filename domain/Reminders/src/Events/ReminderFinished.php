<?php

declare(strict_types=1);

namespace Domain\Reminders\Events;

/**
 * A reminder finished.
 */
final readonly class ReminderFinished implements ReminderEvent
{
    public function __construct(
        public string $reminderId,
    ) {}
}
