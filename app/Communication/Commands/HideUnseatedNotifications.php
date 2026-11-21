<?php

declare(strict_types=1);

namespace App\Communication\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Hides up to a batch of an actor's question receipts whose question went to an inbox the actor no longer sits at,
 * so their titles, links and count leave the actor's bell; it answers how many it hid. Run by the journal itself
 * after a holder changed.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::EngineMaintenance)]
final readonly class HideUnseatedNotifications extends Command
{
    public const int BATCH = 200;

    public function __construct(
        public string $recipientType,
        public string $recipientId,
    ) {}
}
