<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use App\Support\ActorReference;
use Domain\Tasks\Contracts\TaskRunEvent;

/**
 * An actor claimed a run of a task, as it started or resumed it. Raised once the claim has committed, with the
 * assignments the claim stands on, so the run's frame knows when the claim stops holding.
 */
final readonly class TaskRunClaimed implements TaskEvent, TaskRunEvent
{
    /**
     * @param  list<string>  $assignmentIds  the claim's own assignment and those it stands on
     */
    public function __construct(
        public string $taskId,
        public int $runNumber,
        public ActorReference $holder,
        public array $assignmentIds,
    ) {}
}
