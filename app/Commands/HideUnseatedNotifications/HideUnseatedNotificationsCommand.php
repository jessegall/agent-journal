<?php

declare(strict_types=1);

namespace App\Commands\HideUnseatedNotifications;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Hides up to a batch of an actor's question receipts whose question went to an inbox the actor no longer sits at,
 * so their titles, links and count leave the actor's bell; it answers how many it hid. Run by the journal itself
 * after a holder changed.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class HideUnseatedNotificationsCommand extends Command
{
    public const int BATCH = 200;

    public function __construct(
        public string $recipientType,
        public string $recipientId,
    ) {}
}
