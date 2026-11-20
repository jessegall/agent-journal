<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\RunKeyScriptHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Agents\Values\ScriptParameter;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * An operator's request to run one registered maintenance key script, such as ChangeModel, on an agent's terminal. The
 * script is named by the operator's command, never read from a message body.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(RunKeyScriptHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::RunKeyScript)]
#[Operation('run_key_script', ResourceAreaType::Workspace, AccessType::Execute)]
final readonly class RunKeyScript extends Command implements HasAuthorizationSubject, TargetsAgentStack
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
