<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\DriverOperation;
use App\Agents\Handlers\RecordRuntimeHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * The owner asks the host to start, or stop, a redacted recording of an agent's runtime, written in the host's
 * private state folder.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(RecordRuntimeHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class RecordRuntime extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public bool $stop,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }

    public function operation(): DriverOperation
    {
        return $this->stop ? DriverOperation::StopRecording : DriverOperation::StartRecording;
    }

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
