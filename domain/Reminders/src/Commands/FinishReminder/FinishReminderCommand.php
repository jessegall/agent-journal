<?php

declare(strict_types=1);

namespace Domain\Reminders\Commands\FinishReminder;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Reminders\Policies\ReminderPolicy;

/**
 * Marks one of the caller's open reminders done.
 *
 * @extends Command<null>
 */
#[Authorize(ReminderPolicy::class, AccessType::Edit)]
final readonly class FinishReminderCommand extends Command
{
    public function __construct(public string $reminderId) {}
}
