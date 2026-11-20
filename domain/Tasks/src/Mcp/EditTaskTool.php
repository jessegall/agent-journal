<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Api\TaskTextLimits;
use Domain\Tasks\Commands\EditTask;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_edit')]
#[IsDestructive(false)]
#[Dispatches(EditTask::class)]
#[Description('Change the title or brief of a task at the revision you read.')]
final class EditTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->taskSchema($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'title' => $schema->string()->max(TaskTextLimits::TITLE),
            'brief' => $schema->string()->max(TaskTextLimits::NOTE),
        ];
    }

    protected function command(ToolArguments $arguments): EditTask
    {
        return new EditTask(
            $arguments->ulid('task_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->optionalText('title'),
            $arguments->optionalText('brief'),
        );
    }

    protected function present(mixed $revision): ToolResult
    {
        return ToolResult::ok(['revision' => $revision]);
    }
}
