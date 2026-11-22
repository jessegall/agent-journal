<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Api\TaskProofPage;
use Domain\Tasks\Contracts\TaskProofResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Models\TaskCheck;

/**
 * Reads a task's proofs a page at a time for a caller who may read the task, newest first by id, one more row than
 * the page to know whether older proofs remain.
 */
final readonly class TaskProofRecords implements TaskProofResolver
{
    public const int LARGEST_PAGE = 100;

    public function __construct(private TaskResolver $visibility) {}

    public function proofsOf(string $taskId, string|null $afterId, int $limit): TaskProofPage
    {
        $this->visibility->requireVisible($taskId);
        $size = min(max(1, $limit), self::LARGEST_PAGE);
        $checks = TaskCheck::pageOf($taskId, $afterId, $size + 1);
        $shown = $checks->take($size);

        return new TaskProofPage(
            array_values($shown->map(fn (TaskCheck $check) => $check->proof)->all()),
            $checks->count() > $size ? $checks[$size - 1]->id : null,
        );
    }
}
