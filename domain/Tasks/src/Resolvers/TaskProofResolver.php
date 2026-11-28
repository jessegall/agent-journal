<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Contracts\TaskProofResolver as TaskProofResolverContract;
use Domain\Tasks\Contracts\TaskVisibility;
use Domain\Tasks\Models\TaskCheck;
use Domain\Tasks\Values\TaskProofPage;

/**
 * Reads a task's proofs a page at a time for a caller who may read the task, newest first by id, one more row than
 * the page to know whether older proofs remain.
 */
final readonly class TaskProofResolver implements TaskProofResolverContract
{
    public const int LARGEST_PAGE = 100;

    public function __construct(private TaskVisibility $visibility) {}

    public function proofsOf(string $taskId, string|null $afterId, int $limit): TaskProofPage
    {
        $this->visibility->requireVisible($taskId);
        $size = min(max(1, $limit), self::LARGEST_PAGE);
        $checks = TaskCheck::findPageOf($taskId, $afterId, $size + 1);
        $shown = $checks->take($size);

        return new TaskProofPage(
            array_values($shown->map(fn (TaskCheck $check) => $check->proof)->all()),
            $checks->count() > $size ? $checks[$size - 1]->id : null,
        );
    }
}
