<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\OpenJournalStart;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Opens a headless Claude Code start the journal drives itself: it takes the pending start for the runtime's host,
 * chooses the conversation every turn continues and orders the build probe. It answers the probe's process id, or none;
 * run when a start is registered.
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenJournalStartCommand extends Command
{
    public function __construct(public string $sessionId) {}
}
