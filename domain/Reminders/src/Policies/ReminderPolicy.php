<?php

declare(strict_types=1);

namespace Domain\Reminders\Policies;

use App\Contracts\Authorization\Policy;
use Domain\Reminders\Models\Reminder;

/**
 * Who may work with reminders: every granted actor, so the grants decide.
 */
final readonly class ReminderPolicy implements Policy
{
    public static function model(): string
    {
        return Reminder::class;
    }
}
