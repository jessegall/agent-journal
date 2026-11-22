<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use App\Actors\Contracts\CurrentActor;
use Domain\Tasks\Api\TaskReviewText;
use Domain\Tasks\Contracts\TaskReviewTexts;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;

/**
 * Reads the texts of a batch of tasks under shared row locks taken in id order, one query for the batch.
 */
final readonly class TaskReviewTextRecords implements TaskReviewTexts
{
    public function __construct(private CurrentActor $actors) {}

    public function textsOf(array $taskIds): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique($taskIds));
        $tasks = Task::query()->whereKey($ids)->orderBy('id')->sharedLock()
            ->readExactly(count($ids))->get(['id', 'number', 'title', 'brief', 'revision'])->keyBy('id');

        return array_map(function (string $id) use ($tasks): TaskReviewText {
            $task = $tasks->get($id) ?? throw TaskMissing::forId($id);

            return new TaskReviewText($task->id, $task->number, $task->title, $task->brief, $task->revision);
        }, $taskIds);
    }
}
