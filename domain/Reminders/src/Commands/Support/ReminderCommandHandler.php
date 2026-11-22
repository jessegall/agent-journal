<?php

declare(strict_types=1);

namespace Domain\Reminders\Commands\Support;

use App\Contracts\CommandHandler;

/**
 * The base every command handler of Reminders extends.
 */
abstract readonly class ReminderCommandHandler implements CommandHandler {}
