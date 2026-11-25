<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Support\ReadToolSearchAccess;
use App\Values\OpenAction;
use App\Values\RecordLocation;
use Domain\Tasks\Support\Mcp\TaskLogReadResult;
use Domain\Tasks\Support\Mcp\TaskReadResult;

/**
 * Who may search task log lines: whoever may read the parent task, an agent through tasks_read for that task. A
 * line opens through tasks_log_read, which asks the same read of its task again before it shows the line.
 */
final readonly class TaskLogSearchAccess extends ReadToolSearchAccess
{
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        if ($location === null) {
            return parent::openAction($recordId, null);
        }

        return new OpenAction(TaskLogReadResult::TOOL, [
            TaskReadResult::ID_ARGUMENT => $recordId,
            TaskLogReadResult::ENTRY_ARGUMENT => $location->id,
        ]);
    }

    protected function readName(): string
    {
        return TaskReadResult::TOOL;
    }

    protected function idArgument(): string
    {
        return TaskReadResult::ID_ARGUMENT;
    }

    /**
     * A log line opens the inspector on its Logs tab at that line.
     *
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array
    {
        if ($location === null) {
            return [];
        }

        return [
            'tab' => 'logs',
            'entry' => $location->id,
        ];
    }
}
