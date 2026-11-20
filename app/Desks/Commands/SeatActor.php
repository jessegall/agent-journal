<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Desks\Handlers\SeatActorHandler;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;
use App\Operations\Enums\AccessType;

/**
 * Seats an actor in a desk's lowest free seat.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(SeatActorHandler::class)]
#[Authorize(DeskPolicy::class, AccessType::Create)]
final readonly class SeatActor extends Command
{
    public function __construct(
        public string $deskId,
        public ActorIdentity $actor,
    ) {}
}
