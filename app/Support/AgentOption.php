<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Agents\AgentAction;
use App\Enums\Agents\AgentPresence;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\HoldReason;
use App\Exceptions\SessionOutdated;

/**
 * An agent Home can show, live or idle: its name, whether it is retired, its live session with its process generation and the switch that last
 * moved it, the actions it offers now, the conversations a resume may continue, its latest launch outcome the viewer
 * has not dismissed and the status all its views show.
 */
final readonly class AgentOption
{
    /**
     * @param  list<AgentAction>  $actions
     * @param  list<ResumableConversation>  $conversations
     */
    public function __construct(
        public string $agentId,
        public string $name,
        public string $profileKey,
        public AssigneeIdentity $assignee,
        public bool $isRetired,
        public AgentPresence $presence,
        public string|null $sessionId,
        public int $sessionGeneration,
        public bool $hasTerminal,
        public string|null $switchId,
        public DriverSwitchStage|null $switchStage,
        public array $actions,
        public array $conversations,
        public string|null $startRefusal,
        public SessionStartOutcome|null $launchOutcome,
        public AgentStatus $status,
        public string|null $sessionDriver = null,
        // The label of the driver the session was launched on, as stored then.
        public string|null $sessionDriverLabel = null,
        // The model the session runs on, as the driver names it; none without a session.
        public string|null $sessionModel = null,
        // What holds the current runtime now, with the session and generation above it belongs to.
        public HoldReason $hold = HoldReason::None,
    ) {}

    /**
     * Refuses a message written for another session or process generation than the one the agent runs now; one
     * written while the agent was idle reaches its inbox.
     *
     * @throws SessionOutdated
     */
    public function assertRuns(string|null $sessionId, int $generation): void
    {
        if ($this->sessionId !== $sessionId || $this->sessionGeneration !== $generation) {
            throw SessionOutdated::forAgent($this->agentId);
        }
    }
}
