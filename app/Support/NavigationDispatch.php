<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ActorAttention;
use App\Contracts\MainDesk;
use App\Enums\NavigationAnswerer;
use App\Models\AgentRuntime;
use App\Models\NavigationRequest;

/**
 * Puts a navigation request in front of whoever answers it: the main desk, whose occupant is woken once per request
 * and round, unless the stopped runtime is that occupant's own, which the user keeps holding.
 */
final readonly class NavigationDispatch
{
    public function __construct(
        private MainDesk $mainDesk,
        private ActorAttention $attention,
    ) {}

    /**
     * Who answers a key script stopped on the runtime: the user for the main desk occupant's own runtime, the main
     * desk for any other.
     */
    public function answererFor(AgentRuntime $runtime): NavigationAnswerer
    {
        $owner = ActorIdentity::of($runtime->session->agent);

        $ownRuntime = $this->mainDesk->occupant()
            ->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($owner))
            ->getOrElse(false);

        return $ownRuntime ? NavigationAnswerer::User : NavigationAnswerer::MainDesk;
    }

    /**
     * Gives the request to the main desk and wakes its occupant for this round; with nobody seated the request
     * waits, given to the desk, for whoever sits down or for its expiry. A host's raise has no bus receipt, so the
     * raise's own operation key names where the wake came from.
     */
    public function deliver(NavigationRequest $request, int|null $round = null): void
    {
        $this->mainDesk->receive($request);
        $origin = AttentionOrigin::navigation($request->id, $round ?? $request->row_version, $request->operation_key);

        foreach ($this->mainDesk->occupant() as $occupant) {
            $this->attention->request($occupant, $origin);
        }
    }
}
