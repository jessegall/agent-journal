<?php

declare(strict_types=1);

namespace App\Support\States;

use App\Attributes\StateType;
use App\Contracts\Authorization\OperationPolicy;
use App\Enums\FrameReuse;
use App\Enums\SessionTransferType;
use App\Events\StopAttemptSettled;
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
use App\Values\AgentText;
use App\Values\Operation;
use App\Values\SettledStopAttempts;

/**
 * The permanent bottom of every stack: it answers every hook, so a walk never runs out of states. It allows a file
 * change or another tool call only when the agent's policy grants it, never by the agent's role, and a call with one
 * refused operation is refused whole; a shell line is left to Core's admission, which judges every part of it. A stop
 * waits on the stop conditions the session was started under, and the state keeps the outcomes of the attempts it
 * opened, so a run of unchanged failures is counted from its own record.
 */
#[StateType(self::TYPE_KEY, schemaVersion: 1, transfer: SessionTransferType::SessionOnly)]
class ReadyState extends AgentState
{
    public const string TYPE_KEY = 'core.ready';

    /**
     * The stop attempts this stack opened whose results have not come back.
     *
     * @var list<string>
     */
    private array $openAttempts = [];

    /**
     * The newest attempts of this stack that settled, attempt id => the outcome it settled with.
     *
     * @var array<string, string>
     */
    private array $settledAttempts = [];

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
        $answer = $this->stops->answer($input->hook, new SettledStopAttempts($this->settledAttempts));
        $answer->attemptId->forAll($this->keepOpenedAttempt(...));

        return $answer->reply;
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

    // ----------[ Events ]----------

    /**
     * Keeps the outcome of an attempt this stack opened, in the order the attempts were opened.
     */
    public function onStopAttemptSettled(StopAttemptSettled $event): void
    {
        if (! in_array($event->attemptId, $this->openAttempts, true)) {
            return;
        }

        $this->openAttempts = array_values(array_diff($this->openAttempts, [$event->attemptId]));
        $this->settledAttempts[$event->attemptId] = $event->outcome;
        ksort($this->settledAttempts, SORT_STRING);

        // One more than the run that holds the work, so a failure past it is never counted as the run's last.
        $this->settledAttempts = array_slice(
            $this->settledAttempts,
            -(StopConditionGate::UNCHANGED_FAILURES_TO_HOLD + 1),
            preserve_keys: true,
        );
    }

    // ----------[ Internals ]----------

    /**
     * Notes an attempt the gate opened for a stop, once; a retried stop callback finds the attempt it opened.
     */
    private function keepOpenedAttempt(string $attemptId): void
    {
        if (in_array($attemptId, $this->openAttempts, true) || isset($this->settledAttempts[$attemptId])) {
            return;
        }

        $this->openAttempts = array_slice(
            [...$this->openAttempts, $attemptId],
            -StopConditionGate::UNCHANGED_FAILURES_TO_HOLD,
        );
    }

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
                return Decision::deny(AgentText::of('core.access.refused', ['reason' => $decision->reason]));
            }
        }

        return Decision::delegate();
    }
}
