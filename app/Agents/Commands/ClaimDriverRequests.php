<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ClaimDriverRequestsHandler;
use App\Agents\Support\ClaimedRequests;
use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Enums\CommandEntry;

/**
 * Hands a host the next accepted requests of its runtimes, at most a batch, taking turns between runtimes. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<ClaimedRequests>
 */
#[HandledBy(ClaimDriverRequestsHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimDriverRequests implements Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
    ) {}
}
