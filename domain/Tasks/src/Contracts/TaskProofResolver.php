<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskProofPage;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * Reads a task's proofs for whoever may read the task: a bounded page, newest first, after a proof or from the newest.
 */
interface TaskProofResolver
{
    /**
     * @throws TaskMissing
     */
    public function proofsOf(string $taskId, string|null $afterId, int $limit): TaskProofPage;
}
