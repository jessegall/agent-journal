<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\ClaimDriverRequestsHandler;
use App\Agents\Support\ClaimedRequests;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * Hands a host the next accepted requests of its runtimes, at most a batch, taking turns between runtimes. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @implements Command<ClaimedRequests>
 */
#[HandledBy(ClaimDriverRequestsHandler::class)]
#[RequiresActor(ActorType::System)]
final readonly class ClaimDriverRequests implements Command
{
    public function __construct(
        public string $hostId,
        public int $limit,
    ) {}
}
