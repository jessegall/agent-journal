<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Api\TaskTextLimit;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_block')]
#[IsDestructive(false)]
#[Dispatches(BlockTask::class)]
#[Description('Block your current task run with the reason it must wait.')]
final class BlockTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->runSchema($schema),
            'reason' => $schema->string()->max(TaskTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): BlockTask
    {
        return new BlockTask(
            $arguments->ulid('task_id'),
            $arguments->positiveInteger('run_number'),
            $arguments->text('reason'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => TaskState::Blocked->value]);
    }
}
