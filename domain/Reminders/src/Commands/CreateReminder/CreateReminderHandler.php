<?php

declare(strict_types=1);

namespace Domain\Reminders\Commands\CreateReminder;

use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\Support\ReminderCommandHandler;
use Domain\Reminders\Models\Reminder;

final readonly class CreateReminderHandler extends ReminderCommandHandler
{
    public function handle(CreateReminderCommand $command): string
    {
        $owner = ActorIdentity::of($command->dispatchedBy());

        return Reminder::create($owner, $command->title, CarbonImmutable::parse($command->dueAt))->id;
    }
}
