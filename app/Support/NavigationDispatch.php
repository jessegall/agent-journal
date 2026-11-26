<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Inboxes\MainInbox;
use App\Enums\Navigation\NavigationHandler;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\NavigationRequest;

/**
 * Puts a navigation request in front of whoever answers it: main, whose occupant is woken once per request
 * and round, unless the stopped runtime is that occupant's own, which the user keeps holding.
 */
final readonly class NavigationDispatch
{
    public function __construct(
        private MainInbox $main,
        private ActorAttention $attention,
    ) {}

    /**
     * Who answers a key script stopped on the runtime: the user for main's agent's own runtime, the main
     * desk for any other.
     */
    public function handlerFor(AgentRuntime $runtime): NavigationHandler
    {
        $owner = ActorReference::of($runtime->session->agent);

        $ownRuntime = $this->main->occupant()
            ->map(fn (ActorReference $occupant) => $occupant->isSameAs($owner))
            ->getOrElse(false);

        if ($ownRuntime) {
            return NavigationHandler::User;
        }

        return NavigationHandler::MainInbox;
    }

    /**
     * Gives the request to main and wakes its occupant for this round; with nobody seated the request
     * waits, given to the desk, for whoever sits down or for its expiry. A host's raise has no bus receipt, so the
     * raise's own operation key names where the wake came from.
     */
    public function deliver(NavigationRequest $request, int|null $round = null): void
    {
        $this->main->receive($request);
        $origin = AttentionOrigin::navigation($request->id, $round ?? $request->row_version, $request->operation_key);

        foreach ($this->main->occupant() as $occupant) {
            $this->attention->request($occupant, $origin);
        }
    }
}
