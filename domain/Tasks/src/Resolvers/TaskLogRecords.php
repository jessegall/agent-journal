<?php

declare(strict_types=1);

namespace Domain\Tasks\Resolvers;

use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Values\TaskLogPage;
use Illuminate\Database\Eloquent\Collection;

/**
 * Reads a task's log a bounded page at a time for a caller who may read the task, by (sequence, id), reading one row
 * more than the page to know whether more remain; lines always come oldest first.
 */
final readonly class TaskLogRecords implements TaskLogResolver
{
    public const int LARGEST_PAGE = 100;

    public function __construct(private TaskResolver $visibility) {}

    public function newest(string $taskId, int $limit): TaskLogPage
    {
        $this->visibility->requireVisible($taskId);
        $size = self::sizeOf($limit);
        $read = TaskLogEntry::pageBefore($taskId, null, $size + 1);
        $lines = $read->take($size)->reverse()->values();

        return $this->page($lines, $read->count() > $size, $lines->last()?->sequence);
    }

    public function before(string $taskId, int $sequence, int $limit): TaskLogPage
    {
        $this->visibility->requireVisible($taskId);
        $size = self::sizeOf($limit);
        $read = TaskLogEntry::pageBefore($taskId, $sequence, $size + 1);

        return $this->page($read->take($size)->reverse()->values(), $read->count() > $size, null);
    }

    public function after(string $taskId, int $sequence, int $limit): TaskLogPage
    {
        $this->visibility->requireVisible($taskId);
        $size = self::sizeOf($limit);
        $lines = TaskLogEntry::pageAfter($taskId, $sequence, $size);

        return new TaskLogPage(
            array_values($lines->map(fn (TaskLogEntry $entry) => $entry->line)->all()),
            null,
            $lines->isEmpty() ? $sequence : $lines->last()->sequence,
        );
    }

    /**
     * @param  Collection<int, TaskLogEntry>  $lines  oldest first
     */
    private function page(Collection $lines, bool $hasOlder, int|null $newerAfter): TaskLogPage
    {
        return new TaskLogPage(
            array_values($lines->map(fn (TaskLogEntry $entry) => $entry->line)->all()),
            $hasOlder ? $lines->first()?->sequence : null,
            $newerAfter,
        );
    }

    private static function sizeOf(int $limit): int
    {
        return min(max(1, $limit), self::LARGEST_PAGE);
    }
}
