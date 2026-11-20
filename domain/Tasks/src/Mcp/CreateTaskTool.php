<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Api\TaskTextLimits;
use Domain\Tasks\Commands\CreateTask;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('tasks_create')]
#[Dispatches(CreateTask::class)]
#[Description('Open a task with its title and brief.')]
final class CreateTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->max(TaskTextLimits::TITLE)->required(),
            'brief' => $schema->string()->max(TaskTextLimits::NOTE)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CreateTask
    {
        return new CreateTask($arguments->text('title'), $arguments->text('brief'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['task_id' => $result]);
    }
}
