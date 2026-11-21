<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

/**
 * Which tasks a list keeps by who holds them: any task, the tasks nobody holds, or the tasks the caller holds.
 */
enum TaskHolderFilter: string
{
    case Any = 'any';
    case Unassigned = 'unassigned';
    case Caller = 'mine';
}
