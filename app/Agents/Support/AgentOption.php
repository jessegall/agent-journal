<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\AgentAction;
use App\Agents\Enums\AgentPresence;
use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Exceptions\SessionOutdated;
use App\Assignments\Support\AssigneeIdentity;

/**
 * An agent Home can show, live or idle: its name, whether it is retired, its live session with its process generation and the switch that last
 * moved it, the actions it offers now and the conversations a resume may continue.
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
        public bool $retired,
        public AgentPresence $presence,
        public string|null $sessionId,
        public int $sessionGeneration,
        public bool $hasTerminal,
        public string|null $switchId,
        public DriverSwitchStage|null $switchStage,
        public array $actions,
        public array $conversations,
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
