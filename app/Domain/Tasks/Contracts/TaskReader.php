<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Contracts;

use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Readers\VisibleTasks;
use Illuminate\Container\Attributes\Bind;

/**
 * Checks that tasks named by id exist and may be read by whoever acts in this request. It changes nothing; a check
 * that passed says so for that moment only.
 */
#[Bind(VisibleTasks::class)]
interface TaskReader
{
    /**
     * @throws TaskMissing
     */
    public function requireVisible(int $taskId): void;

    /**
     * Every id must be there, or the whole check fails; it never passes for some of them.
     *
     * @param  list<int>  $taskIds
     *
     * @throws TaskMissing
     */
    public function requireAllVisible(array $taskIds): void;
}
