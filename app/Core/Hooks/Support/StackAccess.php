<?php

declare(strict_types=1);

namespace App\Core\Hooks\Support;

use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Agents\Support\AgentContext;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Hooks\Exceptions\HookIdentityExpired;
use App\Core\Hooks\Inputs\HookIdentity;
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

    /**
     * The bottom state the calling agent's role has.
     */
    public function role(): ReadyStateType
    {
        return ReadyStateType::forKey($this->context->role);
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
        $call = $this->context->call;

        if (! $this->retryWindow->includes($call->issuedAt, CarbonImmutable::now())) {
            throw HookIdentityExpired::forCall($call->callId, $this->retryWindow->seconds);
        }

        return new HookIdentity($this->context->agentId, $this->context->sessionId, $call->callId, $call->bodyDigest);
    }
}
