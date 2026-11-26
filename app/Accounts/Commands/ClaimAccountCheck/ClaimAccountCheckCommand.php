<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ClaimAccountCheck;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\ClaimedAccountCheck;
use App\Attributes\Commands\Entry;
use App\Support\Command;

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
