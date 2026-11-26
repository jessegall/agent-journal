<?php

declare(strict_types=1);

namespace Domain\Reminders\Commands\CreateReminder;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Support\Command;
use Domain\Reminders\Models\Reminder;
use Domain\Reminders\Policies\ReminderPolicy;
use Spatie\LaravelData\Attributes\Validation\Date;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Makes an open reminder for the caller, due at one moment written as a date and time; it answers the new reminder's
 * id.
 *
 * @extends Command<string>
 */
#[Authorize(ReminderPolicy::class, AccessType::Create)]
final readonly class CreateReminderCommand extends Command
{
    public function __construct(
        #[Required, Max(Reminder::TITLE_CHARACTER_LIMIT)]
        public string $title,
        #[Required, Date]
        public string $dueAt,
    ) {}
}
