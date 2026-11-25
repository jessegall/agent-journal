<?php

declare(strict_types=1);

namespace Domain\Tasks\Enums;

/**
 * Whether a run of a task is still worked on.
 */
enum TaskRunStatus: string
{
    case Running = 'running';
    case Finished = 'finished';
}
