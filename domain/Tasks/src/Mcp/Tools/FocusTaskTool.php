<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\FocusTask\FocusTaskCommand;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_focus')]
#[IsDestructive(false)]
#[Dispatches(FocusTaskCommand::class)]
#[Description('Put one of your started tasks in focus: its work comes back on top and is the work in hand again.')]
final class FocusTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['task_id' => $this->recordIdArgument($schema)];
    }

    protected function command(ToolArguments $arguments): FocusTaskCommand
    {
        return new FocusTaskCommand($arguments->ulid(TaskReadResult::ID_ARGUMENT));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['focused' => true]);
    }
}
