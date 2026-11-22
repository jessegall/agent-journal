<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Mcp;

use App\Enums\ReadView;
use App\Mcp\Data\ToolResult;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Values\TaskLogLine;
use Domain\Tasks\Values\TaskLogLocation;

/**
 * One log line of a task, as search opened it, with the lines just before and after it. The task is read through
 * its details first, so a task the caller may not read is missing; a line the task no longer has is unavailable,
 * never answered by the task's summary.
 */
final readonly class TaskLogReadResult
{
    public const string TOOL = 'tasks_log_read';

    public const string ENTRY_ARGUMENT = 'entry_id';

    private const int CONTEXT_LINES = 3;

    public function __construct(
        private TaskDetailsResolver $tasks,
        private TaskLogResolver $log,
    ) {}

    /**
     * @throws TaskPassageUnavailable
     */
    public function read(string $taskId, string $entryId): ToolResult
    {
        $task = $this->tasks->details($taskId, ReadView::Summary);
        $entry = TaskLogEntry::query()->where('task_id', $taskId)->whereKey($entryId)->first();

        if (! $entry instanceof TaskLogEntry) {
            throw TaskPassageUnavailable::make();
        }

        $line = $entry->line;

        return ToolResult::ok([
            'task_id' => $task->id,
            'number' => $task->number,
            'location' => TaskLogLocation::of($line)->label(),
            'entry' => self::lineOf($line),
            'before' => self::linesOf($this->log->before($taskId, $line->sequence, self::CONTEXT_LINES)->lines),
            'after' => self::linesOf($this->log->after($taskId, $line->sequence, self::CONTEXT_LINES)->lines),
        ]);
    }

    /**
     * @param  list<TaskLogLine>  $lines
     * @return list<array{entry_id: string, run_number: int, sequence: int, text: string, at: string}>
     */
    private static function linesOf(array $lines): array
    {
        return array_map(self::lineOf(...), $lines);
    }

    /**
     * @return array{entry_id: string, run_number: int, sequence: int, text: string, at: string}
     */
    private static function lineOf(TaskLogLine $line): array
    {
        return [
            'entry_id' => $line->id,
            'run_number' => $line->runNumber,
            'sequence' => $line->sequence,
            'text' => $line->text,
            'at' => $line->at->toIso8601String(),
        ];
    }
}
