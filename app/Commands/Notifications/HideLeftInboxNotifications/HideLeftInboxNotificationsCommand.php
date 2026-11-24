<?php

declare(strict_types=1);

namespace App\Commands\Notifications\HideLeftInboxNotifications;

use App\Support\Command;

/**
 * Hides, a batch at a time, the question notifications an actor holds for an inbox it left; returns how many it hid.
 *
 * @extends Command<int>
 */
final readonly class HideLeftInboxNotificationsCommand extends Command
{
    public const int BATCH = 200;

    public function __construct(
        public string $recipientType,
        public string $recipientId,
        public string $inboxId,
    ) {}
}
