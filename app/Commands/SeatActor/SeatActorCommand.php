<?php

declare(strict_types=1);

namespace App\Commands\SeatActor;

use App\Attributes\Authorize;
use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\AccessType;
use App\Policies\DeskPolicy;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\SeatChangeResult;

/**
 * Seats an actor in a desk's lowest free seat.
 *
 * @extends Command<SeatChangeResult>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(DeskPolicy::class, AccessType::Create)]
final readonly class SeatActorCommand extends Command
{
    public function __construct(
        public string $deskId,
        public ActorIdentity $actor,
    ) {}
}
