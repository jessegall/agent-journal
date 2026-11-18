<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Domain\Tasks\Enums\TaskWorkState;

/**
 * Who works on a task now, apart from who holds it: the agent and its label, the journal session and its run, and how
 * that run stands.
 */
final readonly class TaskExecution
{
    public function __construct(
        public string $agentId,
        public string $agentLabel,
        public string $sessionId,
        public int $runNumber,
        public TaskWorkState $workState,
    ) {}
}
