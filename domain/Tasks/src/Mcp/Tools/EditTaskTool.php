<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Enums\TaskTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_edit')]
#[IsDestructive(false)]
#[Dispatches(EditTaskCommand::class)]
#[Description('Change the title or brief of a task at the revision you read.')]
final class EditTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'task_id' => $this->recordIdArgument($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'title' => $schema->string()->max(TaskTextLimit::Title->value),
            'brief' => $schema->string()->max(TaskTextLimit::Note->value),
        ];
    }

    protected function command(ToolArguments $arguments): EditTaskCommand
    {
        return new EditTaskCommand(
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
