<?php

declare(strict_types=1);

namespace App\Desks\Commands;

use App\Actors\Support\ActorIdentity;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Attributes\RetainedActorRequestKey;
use App\Bus\Support\Command;
use App\Desks\Policies\DeskPolicy;
use App\Desks\Support\SeatChangeResult;
use App\Operations\Enums\AccessType;

/**
 * Seats an actor at its preferred personal desk again when that seat is still free, or gives it a new personal desk;
 * a later occupant is never moved.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Create)]
final readonly class RestoreActorDesk extends Command
{
    public function __construct(public ActorIdentity $actor) {}
}
