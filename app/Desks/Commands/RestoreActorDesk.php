<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Desks\Enums\DeskAbility;
use App\Desks\Handlers\RestoreActorDeskHandler;
use App\Desks\Models\DeskRecord;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;

/**
 * Seats an actor at its preferred personal desk again when that seat is still free, or gives it a new personal desk;
 * a later occupant is never moved.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[HandledBy(RestoreActorDeskHandler::class)]
#[Authorize(DeskPolicy::class, DeskAbility::Arrange)]
final readonly class RestoreActorDesk extends Command implements HasAuthorizationSubject
{
    public function __construct(public ActorIdentity $actor) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return DeskRecord::class;
    }
}
