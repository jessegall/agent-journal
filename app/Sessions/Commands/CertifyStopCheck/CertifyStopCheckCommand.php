<?php

declare(strict_types=1);

namespace App\Sessions\Commands\CertifyStopCheck;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\StackTarget;

/**
 * Certifies the work of a stop whose attempt passed its stop conditions.
 *
 * @extends Command<void>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class CertifyStopCheckCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $stopId,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }

    public function stop(): HookIdentity
    {
        return new HookIdentity($this->agentId, $this->sessionId, $this->stopId, '');
    }
}
