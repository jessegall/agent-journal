<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Contracts\Authorization\OperationPolicy;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\Operation;

/**
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states. It allows a file
 * change or another tool call only when the agent's policy grants it, never by the agent's role, and a call with one
 * refused operation is refused whole; a shell line is left to Core's admission, which judges every part of it. A stop
 * waits on the stop conditions the session was started under.
 */
#[StateType(self::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
class ReadyState extends AgentState
{
    public const string TYPE_KEY = 'core.ready';

    public function __construct(
        private readonly OperationPolicy $policy,
        private readonly StopConditionGate $stops,
    ) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerType;
    }

    // ----------[ Hooks ]----------

    public function onSessionStart(SessionStarted $input): Decision
    {
        return Decision::delegate();
    }

    public function onPrompt(PromptSubmitted $input): Decision
    {
        return Decision::delegate();
    }

    public function onShellCommand(ShellCommandRequested $input): Decision
    {
        return Decision::delegate();
    }

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->decide([$input->operation]);
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->decide($input->changes->operations());
    }

    public function onStop(StopRequested $input): Decision|MessageLine
    {
        return $this->stops->answer($input->hook);
    }

    public function onCompaction(ContextCompacted $input): Decision
    {
        return Decision::delegate();
    }

    public function onToolFinished(ToolFinished $input): Decision
    {
        return Decision::delegate();
    }

    public function onSessionEnd(SessionEnded $input): Decision
    {
        return Decision::delegate();
    }

    // ----------[ Internals ]----------

    /**
     * Passes the call when the policy grants every operation of it, else refuses it with the first refusal's reason.
     *
     * @param  list<Operation>  $operations
     */
    private function decide(array $operations): Decision
    {
        foreach ($operations as $operation) {
            $decision = $this->policy->assess($operation);

            if (! $decision->allowed) {
                return Decision::deny($decision->reason);
            }
        }

        return Decision::delegate();
    }
}
