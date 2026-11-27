<?php

declare(strict_types=1);

namespace App\Sessions\States;

use App\Access\Contracts\OperationPolicy;
use App\Contracts\Events\Event;
use App\Events\Connections\HostProcessOpened;
use App\Events\Sessions\AgentRuntimeStopRequested;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Sessions\Commands\EndStoppedSession\EndStoppedSessionCommand;
use App\Sessions\Contracts\SessionFact;
use App\Sessions\States\Support\ReadyStateReference;
use App\Sessions\States\Values\SessionRun;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\UniqueState;
use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\ToolRequested;
use App\Values\AgentText;
use App\Values\Operation;
use Generator;

/**
 * The bottom of every stack: a file change or tool call passes only when the agent's policy grants it. It owns whether
 * the session runs, and ends a stopped session once none of its processes runs, as a headless one has none between
 * its turns.
 */
#[StateType(ReadyStateReference::class, schemaVersion: 1)]
class ReadyState extends AgentState implements UniqueState
{
    private SessionRun $run;

    public function __construct(
        private readonly OperationPolicy $policy,
        private readonly string $agentId,
        private readonly string $sessionId,
    ) {
        $this->run = SessionRun::from([]);
    }

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
        $this->run->askStop();

        if ($this->run->isOver()) {
            yield new EndStoppedSessionCommand($this->agentId, $this->sessionId);
        }
    }

    public function onHostProcessOpened(HostProcessOpened $event): void
    {
        $this->run->openProcess($event->processId);
    }

    /**
     * A process of the session exited or was lost: once a stop was asked and none runs, the session ends.
     *
     * @return Generator<int, EndStoppedSessionCommand>
     */
    public function onHostProcessEndEvent(HostProcessEndEvent $event): Generator
    {
        $this->run->endProcess($event->processId);

        if ($this->run->isOver()) {
            yield new EndStoppedSessionCommand($this->agentId, $this->sessionId);
        }
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

            if (! $decision->isAllowed) {
                return Decision::deny(AgentText::of('core.access.refused', ['reason' => $decision->reason]));
            }
        }

        return Decision::delegate();
    }
}
