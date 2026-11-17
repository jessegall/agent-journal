<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use App\Domain\Agents\AgentContext;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Storage\StackTarget;
use Carbon\CarbonImmutable;

/**
 * The stack and hook identity of the authenticated agent in this request, and nothing wider.
 */
final readonly class StackAccess
{
    public function __construct(
        private AgentContext $context,
        private HookRetryWindow $retryWindow,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->context->agentId, $this->context->sessionId);
    }

    public function hookIdentity(): HookIdentity
    {
        $call = $this->context->call;

        if (! $this->retryWindow->admits($call->issuedAt, CarbonImmutable::now())) {
            throw HookIdentityExpired::forCall($call->callId, $this->retryWindow->seconds);
        }

        return new HookIdentity($this->context->agentId, $this->context->sessionId, $call->callId, $call->bodyDigest);
    }
}
