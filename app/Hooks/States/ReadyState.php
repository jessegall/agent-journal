<?php

declare(strict_types=1);

namespace App\Hooks\States;

use App\Agents\Values\Operation;
use App\Hooks\Contracts\OperationPolicy;
use App\Hooks\Decisions\Decision;
use App\Hooks\Decisions\MessageLine;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolRequested;
use App\Hooks\States\Contracts\StopConditionGate;

/**
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states. It allows a file
 * change or another tool call only when the agent's policy grants it, never by the agent's role, and a call with one
 * refused operation is refused whole; a shell line is left to Core's admission, which judges every part of it. A stop
 * waits on the stop conditions the session was started under.
 */
class ReadyState extends AgentState
{
    public const string TYPE_KEY = 'hooks.ready';

    public function __construct(
        private readonly OperationPolicy $policy,
        private readonly StopConditionGate $stops,
    ) {}

    public function onSessionStart(SessionStarted $input): null
    {
        return null;
    }

    public function onPrompt(PromptSubmitted $input): null
    {
        return null;
    }

    public function onShellCommand(ShellCommandRequested $input): null
    {
        return null;
    }

    public function onFileEdit(FileEditRequested $input): Decision|null
    {
        return $this->decide($input->changes->operations());
    }

    public function onToolRequested(ToolRequested $input): Decision|null
    {
        return $this->decide([$input->operation]);
    }

    public function onStop(StopRequested $input): Decision|MessageLine|null
    {
        return $this->stops->answer($input->hook);
    }

    public function onCompaction(ContextCompacted $input): null
    {
        return null;
    }

    public function onToolFinished(ToolFinished $input): null
    {
        return null;
    }

    public function onSessionEnd(SessionEnded $input): null
    {
        return null;
    }

    /**
     * Passes the call when the policy grants every operation of it, else refuses it with the first refusal's reason.
     *
     * @param  list<Operation>  $operations
     */
    private function decide(array $operations): Decision|null
    {
        foreach ($operations as $operation) {
            $decision = $this->policy->assess($operation);

            if (! $decision->allowed) {
                return Decision::deny($decision->reason);
            }
        }

        return null;
    }
}
