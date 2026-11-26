<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Exceptions\StackTargetRefused;
use App\Hooks\HookRetryWindow;
use App\Sessions\Contracts\AgentCallContext;
use App\Sessions\Exceptions\AgentContextMissing;
use App\Stacks\Exceptions\HookIdentityExpired;
use App\Support\AgentContext;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * The stack and hook identity of the authenticated agent in this request, and nothing wider. The agent context is read
 * when asked for, like the current session, so a class that only may act for an agent can be built in any request.
 */
final readonly class StackAccess
{
    public function __construct(
        private AgentCallContext $calls,
        private HookRetryWindow $retryWindow,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->context()->agentId, $this->context()->sessionId);
    }

    /**
     * Refuses a stack other than the calling agent's own.
     */
    public function assertTargetGranted(StackTarget $target): void
    {
        if ($target != $this->target()) {
            throw StackTargetRefused::forTarget($target->description());
        }
    }

    public function hookIdentity(): HookIdentity
    {
        $context = $this->context();
        $call = $context->call;

        if (! $this->retryWindow->includes($call->issuedAt, CarbonImmutable::now())) {
            throw HookIdentityExpired::forCall($call->callId, $this->retryWindow->seconds);
        }

        return new HookIdentity($context->agentId, $context->sessionId, $call->callId, $call->bodyDigest);
    }

    /**
     * The calling agent's context; asking for it outside an agent request fails with AgentContextMissing.
     */
    private function context(): AgentContext
    {
        return $this->calls->context()->getOrThrow(AgentContextMissing::forRequest());
    }
}
