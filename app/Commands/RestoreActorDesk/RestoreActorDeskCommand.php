<?php

declare(strict_types=1);

namespace App\Commands\RestoreActorDesk;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\DeskPolicy;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\SeatChangeResult;

/**
 * Seats an actor at its preferred personal desk again when that seat is still free, or gives it a new personal desk;
 * a later occupant is never moved.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Create)]
final readonly class RestoreActorDeskCommand extends Command
{
    public function __construct(public ActorIdentity $actor) {}
}
