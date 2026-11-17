<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use Carbon\CarbonImmutable;

/**
 * Starts a request as one agent and session, the way the endpoint's middleware binds the agent context.
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
    }
}
