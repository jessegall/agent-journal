<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Assignments\Support\AssignmentData;
use App\Assignments\Support\AssignmentHolder;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationStale;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\TextChunk;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Api\TaskDetails;
use Domain\Tasks\Contracts\TaskDetailsResolver;
use Domain\Tasks\Enums\TaskView;
use Domain\Tasks\Http\Data\TaskExecutionData;

/** Presents the same task details for the tool and resource. */
final readonly class TaskReadResult
{
    public const string TOOL = 'tasks_read';

    private const int INLINE_TEXT_BYTES = 3000;

    private const int CHUNK_BYTES = 900;

    public function __construct(private TaskDetailsResolver $tasks, private Continuations $continuations) {}

    public function read(string $taskId, ToolArguments $arguments): ToolResult
    {
        $cursor = $arguments->continuation();
        $view = $cursor === null ? $arguments->enumOr('view', TaskView::Summary) : TaskView::Context;
        $task = $this->tasks->details($taskId, $view);
        $summary = $this->summary($task);
        $text = $this->text($task);
        $encoded = json_encode($text, JSON_THROW_ON_ERROR);

        if ($cursor !== null) {
            $position = $this->continuations->open($cursor, self::TOOL, $taskId);
            $position->requireRevision($task->revision);

            if ($position->filters['text_digest'] !== hash('sha256', $encoded)) {
                throw ContinuationStale::textChanged();
            }

            return $this->chunk($summary, $text, $position, $task->revision);
        }

        if (strlen($encoded) <= self::INLINE_TEXT_BYTES) {
            return ToolResult::ok([...$summary, ...$text]);
        }

        $position = new Continuation(self::TOOL, $taskId, ['field' => 0, 'text_digest' => hash('sha256', $encoded)], 1);

        return $this->chunk($summary, $text, $position, $task->revision);
    }

    /** @return array<string, mixed> */
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

    /** @return array<string, string> */
    private function text(TaskDetails $task): array
    {
        return array_filter([
            'brief' => $task->brief,
            'result_note' => $task->resultNote,
            'block_reason' => $task->blockReason,
            'cancel_reason' => $task->cancelReason,
        ], is_string(...));
    }

    /**
     * @param array<string, mixed> $summary
     * @param array<string, string> $text
     */
    private function chunk(array $summary, array $text, Continuation $position, int $revision): ToolResult
    {
        $field = $position->filters['field'];
        $name = array_keys($text)[$field];
        $chunk = TextChunk::of($text[$name], $position->offset, $position->characterOffset, self::CHUNK_BYTES);

        return ToolResult::ok([
            ...$summary,
            $name => $chunk->text,
            'text_field' => $name,
            'line_start' => $chunk->lineStart,
            'character_offset' => $chunk->characterStart,
        ], $this->next($position, $chunk, $field, count($text), $revision));
    }

    /** @return list<NextAction> */
    private function next(Continuation $position, TextChunk $chunk, int $field, int $total, int $revision): array
    {
        if (! $chunk->hasMore && $field + 1 >= $total) {
            return [];
        }

        $next = new Continuation(
            self::TOOL,
            $position->selector,
            [...$position->filters, 'field' => $chunk->hasMore ? $field : $field + 1],
            $chunk->hasMore ? $chunk->nextLine : 1,
            $chunk->hasMore ? $chunk->nextCharacter : 0,
            $revision,
        );

        return [new NextAction(self::TOOL, [
            'task_id' => $position->selector,
            'continuation' => $this->continuations->issue($next),
        ])];
    }
}
