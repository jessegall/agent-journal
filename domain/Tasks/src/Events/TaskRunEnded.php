<?php

declare(strict_types=1);

namespace Domain\Tasks\Events;

use Domain\Tasks\Contracts\TaskRunEvent;

/**
 * A task's run ended with its outcome.
 */
final readonly class TaskRunEnded implements TaskEvent, TaskRunEvent
{
    public function __construct(
        public string $runId,
        public string $taskId,
    ) {}
}
