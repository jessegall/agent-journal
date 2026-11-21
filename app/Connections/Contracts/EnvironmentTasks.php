<?php

declare(strict_types=1);

namespace App\Connections\Contracts;

use App\Connections\Values\EnvironmentTaskList;

/**
 * The tasks assigned to the acting user that were made through a binding of one environment. Core owns it; the
 * Tasks domain fills it.
 */
interface EnvironmentTasks
{
    /**
     * Their count and the first of them, at most this many, by number.
     */
    public function assignedToActor(string $environmentId, int $most): EnvironmentTaskList;
}
