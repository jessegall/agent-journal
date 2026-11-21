<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\RunTaskCheck;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('tasks_check')]
#[IsDestructive(false)]
#[Dispatches(RunTaskCheck::class)]
#[Description('Record that a process run you opened checks your current task run; its result becomes the proof.')]
final class RunTaskCheckTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->runSchema($schema),
            'process_run_id' => $schema->string()->required(),
            'operation' => $schema->string()->max(200)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): RunTaskCheck
    {
        return new RunTaskCheck(
            $arguments->ulid('task_id'),
            $arguments->positiveInteger('run_number'),
            $arguments->ulid('process_run_id'),
            $arguments->text('operation'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['check_id' => $commandResult]);
    }
}
