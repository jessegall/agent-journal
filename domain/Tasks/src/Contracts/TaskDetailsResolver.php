<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use App\CommandRules\Enums\ReadView;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * One task whoever acts may see, in the view asked for; a task it may not see reads like a missing one.
 */
interface TaskDetailsResolver
{
    /**
     * @throws TaskMissing
     */
    public function details(string $taskId, ReadView $view): TaskDetails;
}
