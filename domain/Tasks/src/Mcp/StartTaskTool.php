<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_start')]
#[IsDestructive(false)]
#[Dispatches(StartTaskCommand::class)]
#[Description('Begin a task run and return its run number.')]
final class StartTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return $this->taskSchema($schema);
    }

    protected function command(ToolArguments $arguments): StartTaskCommand
    {
        return new StartTaskCommand($arguments->ulid('task_id'));
    }

    protected function present(mixed $runNumber): ToolResult
    {
        return ToolResult::ok(['run_number' => $runNumber]);
    }
}
