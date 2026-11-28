<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Contracts\TaskHistoryResolver as TaskHistoryResolverContract;
use Domain\Tasks\Contracts\TaskVisibility;
use Domain\Tasks\Models\TaskHistoryEntry;
use Domain\Tasks\Values\TaskHistoryPage;

/**
 * Reads a task's history a page at a time for a caller who may read the task: newest first by (sequence, id), one more
 * row than the page to know whether older entries remain.
 */
final readonly class TaskHistoryResolver implements TaskHistoryResolverContract
{
    public const int LARGEST_PAGE = 100;

    public function __construct(private TaskVisibility $visibility) {}

    public function historyOf(string $taskId, int|null $beforeSequence, int $limit): TaskHistoryPage
    {
        $this->visibility->requireVisible($taskId);
        $size = min(max(1, $limit), self::LARGEST_PAGE);
        $entries = TaskHistoryEntry::findPageOf($taskId, $beforeSequence, $size + 1);
        $shown = $entries->take($size);

        return new TaskHistoryPage(
            array_values($shown->map(fn (TaskHistoryEntry $entry) => $entry->transition)->all()),
            $entries->count() > $size ? $entries[$size - 1]->sequence : null,
        );
    }
}
