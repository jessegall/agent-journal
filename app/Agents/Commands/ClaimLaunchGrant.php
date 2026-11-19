<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ClaimLaunchGrantHandler;
use App\Agents\Support\LaunchGrant;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Hands a host the launch credential of one of its Starting runtimes, once, with the folders it writes before spawning.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<LaunchGrant|null>
 */
#[HandledBy(ClaimLaunchGrantHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimLaunchGrant extends Command
{
    public function __construct(
        public string $hostId,
        public string $runtimeId,
    ) {}
}
