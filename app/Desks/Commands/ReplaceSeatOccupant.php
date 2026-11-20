<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\ReplaceSeatOccupantHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;

/**
 * Gives a desk's seat to another actor, naming the seat's assignment as it was read.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(ReplaceSeatOccupantHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[Operation('replace_seat_occupant', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class ReplaceSeatOccupant extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $deskId,
        public string $seatId,
        public AssignmentReference $expected,
        public ActorIdentity $actor,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return DeskRecord::class;
    }
}
