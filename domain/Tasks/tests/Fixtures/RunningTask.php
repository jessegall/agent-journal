<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Fixtures;

use App\Models\Agents\AgentSession;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;

/**
 * A task an agent started: the task, the session of the agent working on it and the run its start claimed.
 */
final readonly class RunningTask
{
    public function __construct(public Task $task, public AgentSession $session, public TaskRun $run) {}
}
