<?php

declare(strict_types=1);

namespace Domain\Reminders\Commands\FinishReminder;

use App\Exceptions\ModelMissing;
use Domain\Reminders\Commands\Support\ReminderCommandHandler;
use Domain\Reminders\Exceptions\ReminderEnded;
use Domain\Reminders\Models\Reminder;

final readonly class FinishReminderHandler extends ReminderCommandHandler
{
    /**
     * @throws ReminderEnded
     * @throws ModelMissing
     */
    public function handle(FinishReminderCommand $command): void
    {
        Reminder::ownForUpdate($command->reminderId)->finish();
    }
}
