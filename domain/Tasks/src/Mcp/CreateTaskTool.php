<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\CreateTask\CreateTaskCommand;
use Domain\Tasks\Enums\TaskTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('tasks_create')]
#[Dispatches(CreateTaskCommand::class)]
#[Description('Open a task with its title and brief.')]
final class CreateTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->max(TaskTextLimit::Title->value)->required(),
            'brief' => $schema->string()->max(TaskTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CreateTaskCommand
    {
        return new CreateTaskCommand($arguments->text('title'), $arguments->text('brief'));
    }

    protected function present(mixed $taskId): ToolResult
    {
        return ToolResult::ok(['task_id' => $taskId]);
    }
}
