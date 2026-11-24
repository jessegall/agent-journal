<?php

declare(strict_types=1);

namespace App\Commands\Agents\ClaimStart;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\ClaimedStart;
use App\Support\Command;

/**
 * A host takes the pending process start of a session it is about to start, once; a start already taken, cancelled
 * by maintenance or of an ended session answers nothing, and no process may start for it.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedStart|null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimStartCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $sessionId,
    ) {}
}
