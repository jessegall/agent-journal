<?php

declare(strict_types=1);

namespace App\Commands\Desks\ReplaceSeatOccupant;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\DeskPolicy;
use App\Support\ActorIdentity;
use App\Support\AssignmentReference;
use App\Support\Command;
use App\Support\SeatChangeResult;

/**
 * Gives a desk's seat to another actor, naming the seat's assignment as it was read.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Edit)]
final readonly class ReplaceSeatOccupantCommand extends Command
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
        public ActorIdentity $actor,
    ) {}
}
