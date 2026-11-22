<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use App\Support\ReadToolSearchAccess;
use App\Values\OpenAction;
use App\Values\RecordLocation;
use Domain\Tasks\Support\Mcp\TaskReadResult;

/**
 * Who may search tasks: an agent whose grant holds tasks_read for at least one task, limited to the tasks it holds
 * it for, and every signed-in user of the environment, who reads all its tasks. A brief passage opens through the
 * same read at that passage.
 */
final readonly class TaskSearchAccess extends ReadToolSearchAccess
{
    /**
     * The task summary through tasks_read, or for a brief passage the same read opened at that passage.
     */
    public function openAction(string $recordId, RecordLocation|null $location): OpenAction
    {
        if ($location === null) {
            return parent::openAction($recordId, null);
        }

        $arguments = [TaskReadResult::ID_ARGUMENT => $recordId, 'passage' => $location->id];

        return new OpenAction(TaskReadResult::TOOL, $arguments);
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
     * A brief passage opens the inspector on its Brief tab at that passage.
     *
     * @return array<string, string>
     */
    public function pageQuery(RecordLocation|null $location): array
    {
        if ($location === null) {
            return [];
        }

        return ['tab' => 'brief', 'passage' => $location->id];
    }
}
