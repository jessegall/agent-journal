<?php

declare(strict_types=1);

namespace App\Samples;

use App\Hooks\Contracts\ActorWorkStacks;
use Domain\Tasks\Models\Task;
use Domain\Tasks\States\Support\WorkingOnTaskStateReference;

/**
 * A planted listener that reads the current work and then pushes a task's frame itself, which the advisory
 * work-stack-decision rule must report, beside a look-alike that only reads a task.
 */
final readonly class WorkStackDecision
{
    public function __construct(private ActorWorkStacks $stacks) {}

    public function handle(Task $task): void
    {
        // @sin WorkStackDecisionDetector
        if ($this->stacks->current('tasks.working')->isEmpty()) {
            // @sin WorkStackDecisionDetector
            $this->stacks->push(
                // @sin WorkStackDecisionDetector
                WorkingOnTaskStateReference::forTask($task),
            );
        }
    }

    public function passed(Task $task): int
    {
        return $task->number;
    }
}
