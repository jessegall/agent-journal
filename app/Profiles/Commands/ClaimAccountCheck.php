<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ClaimAccountCheckHandler;
use App\Profiles\Values\ClaimedAccountCheck;

/**
 * A host's runner takes the next account to check with the program's own status check; nothing when none waits.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedAccountCheck|null>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(ClaimAccountCheckHandler::class)]
final readonly class ClaimAccountCheck extends Command
{
    public function __construct(public string $hostId) {}
}
