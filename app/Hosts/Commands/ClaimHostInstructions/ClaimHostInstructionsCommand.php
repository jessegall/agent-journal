<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimHostInstructions;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Values\HostInstructionClaim;
use App\Support\Command;

/**
 * A host takes the instructions it may carry out now, oldest first per process. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<HostInstructionClaim>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimHostInstructionsCommand extends Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
    ) {}
}
