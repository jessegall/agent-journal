<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Support\ClaimedRequests;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Hands a host the next accepted requests of its runtimes, at most a batch, taking turns between runtimes. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedRequests>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimDriverRequests extends Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
    ) {}
}
