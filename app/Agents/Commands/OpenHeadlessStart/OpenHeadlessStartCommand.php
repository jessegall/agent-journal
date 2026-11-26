<?php

declare(strict_types=1);

namespace App\Agents\Commands\OpenHeadlessStart;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Opens a headless Claude Code start the journal drives itself, with no host claim: the journal takes the pending
 * start for the runtime's host, chooses the conversation every turn continues and orders the probe that checks the
 * installed build. Answers the probe's process id; none when the start is no such start or was taken already. Run when
 * a start is registered (internal, not exported).
 *
 * @extends Command<string|null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class OpenHeadlessStartCommand extends Command
{
    public function __construct(public string $sessionId) {}
}
