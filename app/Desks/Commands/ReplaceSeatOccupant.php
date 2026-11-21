<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;
use App\Operations\Enums\AccessType;

/**
 * Gives a desk's seat to another actor, naming the seat's assignment as it was read.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Edit)]
final readonly class ReplaceSeatOccupant extends Command
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
        public ActorIdentity $actor,
    ) {}
}
