<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention as ActorAttentionContract;
use App\Resolvers\Support\CurrentAgentRuntimes;

/**
 * Wakes the actor's current runtime through WakeAgent, keyed by the origin, or reports that it runs in none.
 */
final readonly class ActorAttention implements ActorAttentionContract
{
    public function __construct(
        private CurrentAgentRuntimes $runtimes,
        private AgentWakes $wakes,
    ) {}

    public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome
    {
        $runtime = $this->runtimes->currentFor($actor);

        if ($runtime->isEmpty()) {
            return AttentionOutcome::noRuntime();
        }

        $target = $runtime->get()->target;
        $receipt = $this->wakes->wake($target, $origin->keyFor($actor));

        return AttentionOutcome::accepted($receipt->requestId, $receipt->sequence);
    }
}
