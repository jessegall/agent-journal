<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ClaimCleanupHandler;
use App\Profiles\Values\ClaimedCleanup;

/**
 * A host's runner takes the next cleanup: a removed account whose processes ended, or the folder an unfinished new
 * account's sign-in left; nothing when none waits. Run for an authenticated host by the journal itself (internal,
 * not exported).
 *
 * @extends Command<ClaimedCleanup|null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(ClaimCleanupHandler::class)]
final readonly class ClaimCleanup extends Command
{
    public function __construct(
        public string $hostId,
    ) {}
}
