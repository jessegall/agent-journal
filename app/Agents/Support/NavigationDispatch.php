<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Agents\Contracts\MainDesk;
use App\Agents\Enums\NavigationAnswerer;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\NavigationRequest;

/**
 * Puts a navigation request in front of whoever answers it: the main desk, whose occupant is woken once per request
 * and round, unless the stopped runtime is that occupant's own, which the person keeps holding.
 */
final readonly class NavigationDispatch
{
    public function __construct(
        private MainDesk $mainDesk,
        private ActorAttention $attention,
    ) {}

    /**
     * Who answers a key script stopped on the runtime: the person for the main desk occupant's own runtime, the main
     * desk for any other.
     */
    public function answererFor(AgentRuntime $runtime): NavigationAnswerer
    {
        $owner = ActorIdentity::of($runtime->session->agent);
        $ownRuntime = $this->mainDesk->occupant()
            ->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($owner))
            ->getOrElse(false);

        return $ownRuntime ? NavigationAnswerer::Person : NavigationAnswerer::MainDesk;
    }

    /**
     * Gives the request to the main desk and wakes its occupant for this round; with nobody seated the request
     * waits, given to the desk, for whoever sits down or for its expiry.
     */
    public function deliver(NavigationRequest $request, int $round, string $receiptId): void
    {
        $this->mainDesk->receive($request);
        $origin = AttentionOrigin::navigation($request->id, $round, $receiptId);

        foreach ($this->mainDesk->occupant() as $occupant) {
            $this->attention->request($occupant, $origin);
        }
    }
}
