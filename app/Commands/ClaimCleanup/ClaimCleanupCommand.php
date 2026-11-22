<?php

declare(strict_types=1);

namespace App\Commands\ClaimCleanup;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\ClaimedCleanup;

/**
 * A host's runner takes the next cleanup: a removed account whose processes ended, or the folder an unfinished new
 * account's sign-in left; nothing when none waits. Run for an authenticated host by the journal itself (internal,
 * not exported).
 *
 * @extends Command<ClaimedCleanup|null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimCleanupCommand extends Command
{
    public function __construct(
        public string $hostId,
    ) {}
}
