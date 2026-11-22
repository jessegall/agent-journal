<?php

declare(strict_types=1);

namespace App\Agents\Commands\RecordRuntime;

use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Enums\DriverOperation;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * The owner asks the host to start, or stop, a redacted recording of an agent's runtime, written in the host's
 * private state folder.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RecordRuntimeCommand extends Command implements AgentStackCommand
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
}
