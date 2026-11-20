<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\SeatActorHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;

/**
 * Seats an actor in a desk's lowest free seat.
 *
 * @extends Command<SeatChangeResult>
 */
#[HandledBy(SeatActorHandler::class)]
#[Operation('seat_actor', ResourceAreaType::JournalControl, AccessType::Create)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class SeatActor extends Command implements HasAuthorizationSubject
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
