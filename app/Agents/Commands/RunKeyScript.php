<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Actors\Enums\ActorType;
use App\Agents\Handlers\RunKeyScriptHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Agents\Values\ScriptParameter;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Contracts\Command;

/**
 * An operator's request to run one registered maintenance key script, such as LoginMcp, on an agent's terminal. The
 * script is named by the operator's command, never read from a message body.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(RunKeyScriptHandler::class)]
#[RequiresActor(ActorType::User)]
final readonly class RunKeyScript implements Command
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
