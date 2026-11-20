<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentHolder;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Reads\Enums\ReadView;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Api\TaskText;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Http\Data\TaskExecutionData;

/**
 * Presents the same task details for the tool and resource.
 */
final readonly class TaskReadResult
{
    public const string TOOL = 'tasks_read';

    private const int INLINE_TEXT_BYTES = 3000;

    public function __construct(
        private TaskDetailsResolver $tasks,
        private Continuations $continuations,
        private TextFields $fields,
    ) {}

    public function read(string $taskId, ToolArguments $arguments): ToolResult
    {
        $cursor = $arguments->continuation();
        $view = $cursor === null ? $arguments->enumOr('view', ReadView::Summary) : ReadView::Context;
        $task = $this->tasks->details($taskId, $view);
        $summary = $this->summary($task);
        $text = $this->text($task);
        $encoded = json_encode($text, JSON_THROW_ON_ERROR);

        if ($cursor !== null) {
            $position = $this->continuations->open($cursor, self::TOOL, $taskId);
            $position->assertCurrentRevision($task->revision);

            return $this->fields->page($summary, $text, $position, 'task_id');
        }

        if (strlen($encoded) <= self::INLINE_TEXT_BYTES) {
            return ToolResult::ok([...$summary, ...$text]);
        }

        $read = new Continuation(self::TOOL, $taskId, [], 1, revision: $task->revision);
        $position = $this->fields->start($read, $text);

        return $this->fields->page($summary, $text, $position, 'task_id');
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(TaskDetails $task): array
    {
        return [
            'task_id' => $task->id,
            'number' => $task->number,
            'title' => $task->title,
            'state' => $task->state->value,
            'revision' => $task->revision,
            'holder' => $task->holder->map(
                fn (AssignmentHolder $holder) => AssignmentData::ofHolder($holder)->toArray(),
            )->getOrElse(null),
            'execution' => $task->execution === null ? null : TaskExecutionData::fromExecution(
                $task->execution,
            )->toArray(),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function text(TaskDetails $task): array
    {
        if (! $task->text instanceof TaskText) {
            return [];
        }

        return array_filter([
            'brief' => $task->text->brief,
            'result_note' => $task->text->resultNote,
            'block_reason' => $task->text->blockReason,
            'cancel_reason' => $task->text->cancelReason,
        ], is_string(...));
    }
}
