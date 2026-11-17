<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\Actors\Support\ActorContext;
use App\Core\Agents\Support\AgentContext;
use App\Core\AgentRequests\Support\SignedCall;
use App\Core\Actors\Contracts\CurrentActorSetter;
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
