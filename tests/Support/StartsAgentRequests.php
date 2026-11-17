<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\Actors\ActorContext;
use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use App\Core\Contracts\EstablishActor;
use Carbon\CarbonImmutable;

/**
 * Starts a request as one agent and session, or as a person, the way the authenticating middleware binds them.
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
        $this->app->make(EstablishActor::class)->establish(ActorContext::forAgent($agentId));
    }

    protected function startPersonRequestAs(int $personId): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forPerson($personId));
    }
}
