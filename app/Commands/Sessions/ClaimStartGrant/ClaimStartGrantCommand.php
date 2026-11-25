<?php

declare(strict_types=1);

namespace App\Commands\Sessions\ClaimStartGrant;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Support\StartGrant;

/**
 * Hands a host the start token of one of its Starting runtimes, once, with the folders it writes before spawning.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<StartGrant|null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimStartGrantCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
    ) {}
}
