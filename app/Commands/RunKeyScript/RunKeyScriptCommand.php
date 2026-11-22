<?php

declare(strict_types=1);

namespace App\Commands\RunKeyScript;

use App\Attributes\Authorize;
use App\Contracts\AgentStackCommand;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\ScriptParameter;
use App\Values\StackTarget;

/**
 * An operator's request to run one registered maintenance key script, such as ChangeModel, on an agent's terminal. The
 * script is named by the operator's command, never read from a message body.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Execute)]
final readonly class RunKeyScriptCommand extends Command implements AgentStackCommand
{
    /**
     * @param  list<ScriptParameter>  $parameters
     */
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public string $script,
        public array $parameters,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
