<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Actors\Support\AttentionOutcome;
use App\Agents\Resolvers\Support\CurrentAgentRuntimes;

/**
 * Wakes the actor's current runtime through WakeAgent, keyed by the origin, or reports that it runs in none.
 */
final readonly class CurrentRuntimeAttention implements ActorAttention
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
