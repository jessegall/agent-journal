<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

/**
 * Someone who can act in a request: a user or an agent. The core talks to this, never to a user's or an agent's
 * own class.
 */
interface Actor
{
    /**
     * The type of actor this is, as its stored references hold it, such as agent.
     */
    public function actorType(): string;

    /**
     * The id of the user, agent or system behind the actor.
     */
    public function actorId(): string;
}
