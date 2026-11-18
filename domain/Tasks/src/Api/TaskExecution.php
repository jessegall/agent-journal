<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Domain\Tasks\Enums\TaskWorkState;

/**
 * Who works on a task now, apart from who holds it: the agent and its label (null when the caller may not see that
 * agent's name), the journal session and its run, and how that run stands.
 */
final readonly class TaskExecution
{
    public function __construct(
        public string $agentId,
        public string|null $agentLabel,
        public string $sessionId,
        public int $runNumber,
        public TaskWorkState $workState,
    ) {}
}
