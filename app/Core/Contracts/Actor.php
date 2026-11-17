<?php

declare(strict_types=1);

namespace App\Core\Contracts;

use App\Core\Actors\ActorKind;

/**
 * Someone who can act in a request: a user or an agent. The core talks to this, never to a user's or an agent's
 * own class.
 */
interface Actor
{
    public function actorKind(): ActorKind;

    public function actorId(): int;
}
