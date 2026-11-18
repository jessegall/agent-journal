<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Exceptions\HookIdentityExpired;
use App\Hooks\Inputs\HookIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Container\Container;

/**
 * The stack and hook identity of the authenticated agent in this request, and nothing wider. The agent context is read
 * when asked for, like the current session, so a class that only may act for an agent can be built in any request.
 */
final readonly class StackAccess
{
    public function __construct(
        private Container $container,
        private HookRetryWindow $retryWindow,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->context()->agentId, $this->context()->sessionId);
    }

    /**
     * The bottom state the calling agent's role has.
     */
    public function role(): ReadyStateType
    {
        return ReadyStateType::forKey($this->context()->role);
    }

    /**
     * Refuses a stack other than the calling agent's own.
     */
    public function checkTarget(StackTarget $target): void
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
        return $this->container->make(AgentContext::class);
    }
}
