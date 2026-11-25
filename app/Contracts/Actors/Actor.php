<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Enums\Assignments\ActorType;

/**
 * Someone who can act in a request: a user or an agent. The core talks to this, never to a user's or an agent's
 * own class.
 */
interface Actor
{
    /**
     * Whether the actor is a user, an agent or the system.
     */
    public function actorType(): ActorType;

    /**
     * The id of the user, agent or system behind the actor.
     */
    public function actorId(): string;
}
