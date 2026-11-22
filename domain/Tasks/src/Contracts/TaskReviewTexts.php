<?php

declare(strict_types=1);

namespace Domain\Tasks\Contracts;

use Domain\Tasks\Api\TaskReviewText;
use Domain\Tasks\Exceptions\TaskMissing;

/**
 * Reads the texts of a batch of tasks for a review that freezes them, under shared locks taken in id order, so no edit
 * of those tasks commits until the reading transaction ends. Tasks takes only its own locks.
 */
interface TaskReviewTexts
{
    /**
     * The texts in the order of the ids given.
     *
     * @param  list<string>  $taskIds
     * @return list<TaskReviewText>
     *
     * @throws TaskMissing
     */
    public function textsOf(array $taskIds): array;
}
