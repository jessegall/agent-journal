<?php

declare(strict_types=1);

namespace Domain\Tasks\Support\Mcp;

use App\Enums\CommandRules\ReadView;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Contracts\TextFields;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\ToolArguments;
use App\Support\AssignmentData;
use App\Support\AssignmentHolder;
use App\Values\ReadRequest;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Data\TaskDetails;
use Domain\Tasks\Data\TaskExecutionData;
use Domain\Tasks\Data\TaskText;
use Domain\Tasks\Exceptions\TaskPassageUnavailable;
use Domain\Tasks\Values\TaskBriefPassage;

/**
 * Presents the same task details for the tool and resource.
 */
final readonly class TaskReadResult
{
    public const string TOOL = 'tasks_read';

    public const string ID_ARGUMENT = 'task_id';

    private const int INLINE_TEXT_BYTES = 3000;

    public function __construct(
        private TaskDetailsResolver $tasks,
        private Continuations $continuations,
        private TextFields $fields,
    ) {}

    /**
     * The read of one task by id, targeted at that task so a grant scoped to it admits it; the tool, the resource
     * and search all ask with this one request.
     */
    public static function requestFor(string $taskId): ReadRequest
    {
        return ReadRequest::forRecord(self::TOOL, self::ID_ARGUMENT, $taskId);
    }

    public function read(string $taskId, ToolArguments $arguments): ToolResult
    {
        $passage = $arguments->optionalText('passage');

        if ($passage !== null) {
            return $this->readAt($taskId, TaskBriefPassage::fromId($passage));
        }

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
     * The task's context opened at the brief passage a search found, so the first read shows it; a brief changed
     * since, or a passage it no longer has, is unavailable.
     *
     * @throws TaskPassageUnavailable
     */
    public function readAt(string $taskId, TaskBriefPassage $passage): ToolResult
    {
        $task = $this->tasks->details($taskId, ReadView::Context);
        $text = $this->text($task);

        if (! isset($text[TaskBriefPassage::FIELD])) {
            throw TaskPassageUnavailable::make();
        }

        [$line, $character] = $passage->startIn($text[TaskBriefPassage::FIELD], $task->revision);

        $read = new Continuation(self::TOOL, $taskId, [], 1, revision: $task->revision);
        $position = $this->fields->startAt($read, $text, TaskBriefPassage::FIELD, $line, $character);

        return $this->fields->page($this->summary($task), $text, $position, 'task_id');
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
            'state' => $task->status->value,
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
