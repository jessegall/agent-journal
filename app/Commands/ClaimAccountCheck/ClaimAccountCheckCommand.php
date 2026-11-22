<?php

declare(strict_types=1);

namespace App\Commands\ClaimAccountCheck;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;
use App\Values\ClaimedAccountCheck;

/**
 * A host's runner takes the next account to check with the driver's own status check; nothing when none waits.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedAccountCheck|null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimAccountCheckCommand extends Command
{
    public function __construct(public string $hostId) {}
}
