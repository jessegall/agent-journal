<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Access\Contracts\OperationPolicy;
use App\Contracts\Events\Event;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessOpened;
use App\Events\Sessions\AgentRuntimeStopRequested;
use App\Events\Sessions\StopCheckSettled;
use App\Sessions\Commands\EndStoppedSession\EndStoppedSessionCommand;
use App\Sessions\Contracts\SessionFact;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\StopConditionGate;
use App\Stacks\Contracts\Work\UniqueState;
use App\Stacks\Decisions\MessageLine;
use App\Stacks\Support\ReadyStateReference;
use App\Stacks\Values\SettledStopChecks;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Values\AgentText;
use App\Values\Operation;
use Generator;

/**
 * The bottom of every stack, which answers every hook: a file change or tool call passes only when the agent's policy
 * grants it, a shell line is left to Core's admission, and a stop waits on the session's stop conditions. It keeps the
 * outcomes of the attempts it opened, so unchanged failures are counted from its own record. It also owns whether the
 * session runs: it keeps its runtime's live processes and whether a stop was asked, and ends a stopped session once no
 * process of it runs, as a headless one has none between its turns.
 */
#[StateType(ReadyStateReference::class, schemaVersion: 1)]
class ReadyState extends AgentState implements UniqueState
{
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

    /**
     * The processes of the session's runtime the host was told to open and that have not ended.
     *
     * @var list<string>
     */
    private array $liveProcesses = [];

    private bool $isStopAsked = false;

    public function __construct(
        private readonly OperationPolicy $policy,
        private readonly StopConditionGate $stops,
        private readonly string $agentId,
        private readonly string $sessionId,
    ) {}

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof SessionFact || $event->sessionId === $this->sessionId;
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
        $answer = $this->stops->answer($input->hook, new SettledStopChecks($this->settledAttempts));
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
    public function onStopCheckSettled(StopCheckSettled $event): void
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
            -(StopConditionGate::UNCHANGED_FAILURE_LIMIT + 1),
            preserve_keys: true,
        );
    }

    /**
     * A stop was asked of the session: it ends now when nothing of it runs, else once its last process ends.
     *
     * @return Generator<int, EndStoppedSessionCommand>
     */
    public function onAgentRuntimeStopRequested(AgentRuntimeStopRequested $event): Generator
    {
        $this->isStopAsked = true;

        if ($this->isStoppedAndIdle()) {
            yield new EndStoppedSessionCommand($this->agentId, $this->sessionId);
        }
    }

    public function onHostProcessOpened(HostProcessOpened $event): void
    {
        $this->liveProcesses = array_values(array_unique([...$this->liveProcesses, $event->processId]));
    }

    /**
     * @return Generator<int, EndStoppedSessionCommand>
     */
    public function onHostProcessExited(HostProcessExited $event): Generator
    {
        $this->liveProcesses = array_values(array_diff($this->liveProcesses, [$event->processId]));

        if ($this->isStoppedAndIdle()) {
            yield new EndStoppedSessionCommand($this->agentId, $this->sessionId);
        }
    }

    /**
     * @return Generator<int, EndStoppedSessionCommand>
     */
    public function onHostProcessLost(HostProcessLost $event): Generator
    {
        $this->liveProcesses = array_values(array_diff($this->liveProcesses, [$event->processId]));

        if ($this->isStoppedAndIdle()) {
            yield new EndStoppedSessionCommand($this->agentId, $this->sessionId);
        }
    }

    // ----------[ Internals ]----------

    /**
     * Whether a stop was asked and none of the session's processes runs: the session is over.
     */
    private function isStoppedAndIdle(): bool
    {
        return $this->isStopAsked && $this->liveProcesses === [];
    }

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
            -StopConditionGate::UNCHANGED_FAILURE_LIMIT,
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

            if (! $decision->isAllowed) {
                return Decision::deny(AgentText::of('core.access.refused', ['reason' => $decision->reason]));
            }
        }

        return Decision::delegate();
    }
}
