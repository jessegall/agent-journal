<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RecordRuntime;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\StackTarget;

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
        public bool $shouldStop,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }

    public function operation(): DriverOperation
    {
        if ($this->shouldStop) {
            return DriverOperation::StopRecording;
        }

        return DriverOperation::StartRecording;
    }
}
