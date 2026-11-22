<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Models\NavigationRequest;
use App\Support\ActorIdentity;
use PhpOption\Option;

/**
 * The main desk as the agents' side sees it: who sits there, handing it a navigation request, and how many open
 * requests wait at it for its occupant.
 */
interface MainDesk
{
    /**
     * The actor seated at the main desk; none while nobody is.
     *
     * @return Option<ActorIdentity>
     */
    public function occupant(): Option;

    /**
     * Gives the request to the main desk; a request it holds already stays as it is.
     */
    public function receive(NavigationRequest $request): void;

    /**
     * How many open navigation requests the main desk holds, for the actor seated there; none for anyone else.
     */
    public function openRequestsFor(ActorIdentity $actor): int;
}
