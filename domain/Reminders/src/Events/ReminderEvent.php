<?php

declare(strict_types=1);

namespace Domain\Reminders\Events;

use App\Contracts\Events\Event;

/**
 * A fact about reminders: every event of that subject implements it, so a listener typed on it hears them all.
 */
interface ReminderEvent extends Event
{
    public string $reminderId { get; }
}
