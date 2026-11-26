<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ClaimCleanup;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\ClaimedCleanup;
use App\Attributes\Commands\Entry;
use App\Support\Command;

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
