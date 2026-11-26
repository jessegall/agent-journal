<?php

declare(strict_types=1);

namespace App\Inboxes\Contracts;

use App\Models\Drivers\NavigationRequest;
use App\Support\ActorReference;
use PhpOption\Option;

/**
 * Main as the agents' side sees it: the agent attached there, handing it a navigation request, and how many open
 * requests wait at it for that agent.
 */
interface MainInbox
{
    /**
     * The agent attached to main; none while nobody is.
     *
     * @return Option<ActorReference>
     */
    public function occupant(): Option;

    /**
     * Gives the request to main; a request it holds already stays as it is.
     */
    public function receive(NavigationRequest $request): void;

    /**
     * How many open navigation requests main holds, for the agent attached there; none for anyone else.
     */
    public function openRequestsFor(ActorReference $actor): int;
}
