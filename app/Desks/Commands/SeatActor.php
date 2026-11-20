<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\SeatActorHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Seats an actor in a desk's lowest free seat.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(SeatActorHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[Operation('seat_actor', ResourceAreaType::JournalControl, AccessType::Create)]
final readonly class SeatActor extends Command implements AuthorizedCommand
{
    public function __construct(
        public string $deskId,
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
