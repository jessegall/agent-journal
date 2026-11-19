<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ClaimStartGrantHandler;
use App\Agents\Support\StartGrant;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Hands a host the start token of one of its Starting runtimes, once, with the folders it writes before spawning.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<StartGrant|null>
 */
#[HandledBy(ClaimStartGrantHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimStartGrant extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
    ) {}
}
