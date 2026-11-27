<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Enums\TaskTextLimit;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('tasks_cancel')]
#[Dispatches(CancelTaskCommand::class)]
#[Description('Cancel a task with a reason.')]
final class CancelTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            TaskReadResult::ID_ARGUMENT => $this->recordIdArgument($schema),
            'reason' => $schema->string()->max(TaskTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CancelTaskCommand
    {
        return new CancelTaskCommand($arguments->ulid(TaskReadResult::ID_ARGUMENT), $arguments->text('reason'));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => TaskStatus::Cancelled->value]);
    }
}
