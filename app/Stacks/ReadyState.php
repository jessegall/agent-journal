<?php

declare(strict_types=1);

namespace App\Stacks;

use App\Access\Contracts\OperationPolicy;
use App\Contracts\Events\Event;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessOpened;
use App\Events\Sessions\AgentRuntimeStopRequested;
use App\Sessions\Commands\EndStoppedSession\EndStoppedSessionCommand;
use App\Sessions\Contracts\SessionFact;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\UniqueState;
use App\Stacks\Support\ReadyStateReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ToolRequested;
use App\Values\AgentText;
use App\Values\Operation;
use Generator;

/**
 * The bottom of every stack: a file change or tool call passes only when the agent's policy grants it. It owns whether
 * the session runs: it keeps its runtime's live processes and whether a stop was asked, and ends a stopped session
 * once no process of it runs, as a headless one has none between its turns.
 */
#[StateType(ReadyStateReference::class, schemaVersion: 1)]
class ReadyState extends AgentState implements UniqueState
{
    /**
     * The processes of the session's runtime the host was told to open and that have not ended.
     *
     * @var list<string>
     */
    private array $liveProcesses = [];

    private bool $isStopAsked = false;

    public function __construct(
        private readonly OperationPolicy $policy,
        private readonly string $agentId,
        private readonly string $sessionId,
    ) {}

    public function listensTo(Event $event): bool
    {
        return ! $event instanceof SessionFact || $event->sessionId === $this->sessionId;
    }

    // ----------[ Hooks ]----------

    public function onToolRequested(ToolRequested $input): Decision
    {
        return $this->decide([$input->operation]);
    }

    public function onFileEdit(FileEditRequested $input): Decision
    {
        return $this->decide($input->changes->operations());
    }

    // ----------[ Events ]----------

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
