<?php

declare(strict_types=1);

namespace App\Agents\Commands\ClaimStartGrant;

use App\Agents\Support\StartGrant;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

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
