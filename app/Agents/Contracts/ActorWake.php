<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\RunningSessionWake;
use Illuminate\Container\Attributes\Bind;

/**
 * Wakes an actor's running program for work that waits for it. An actor with no running program is not woken: it
 * finds the work when its next session starts.
 */
#[Bind(RunningSessionWake::class)]
interface ActorWake
{
    public function wake(ActorIdentity $actor, string $idempotencyKey): DriverReceipt|null;
}
