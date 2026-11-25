<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Enums\TaskTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('tasks_finish')]
#[Dispatches(FinishTaskCommand::class)]
#[Description('Finish your current task run with a result note.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
final class FinishTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->runSchema($schema),
            'note' => $schema->string()->max(TaskTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): FinishTaskCommand
    {
        return new FinishTaskCommand(
            $arguments->ulid('task_id'),
            $arguments->positiveInteger('run_number'),
            $arguments->text('note'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => TaskStatus::Finished->value]);
    }
}
