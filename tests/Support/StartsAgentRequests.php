<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use Carbon\CarbonImmutable;

/**
 * Starts a request as one agent and session, or as a user, the way the authenticating middleware binds them.
 */
trait StartsAgentRequests
{
    protected function startRequestAs(int $agentId, int $sessionId): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(
            $agentId,
            $sessionId,
            'hooks.main_ready',
            new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
        ));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($agentId));
    }

    protected function startUserRequestAs(int $userId): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($userId));
    }
}
