<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Tasks\Api\TaskTextLimits;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('tasks_finish')]
#[Dispatches(FinishTask::class)]
#[Description('Finish your current task run with a result note.')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
final class FinishTaskTool extends TaskWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->runSchema($schema),
            'note' => $schema->string()->max(TaskTextLimits::NOTE)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): FinishTask
    {
        return new FinishTask(
            $arguments->ulid('task_id'),
            $arguments->positiveInteger('run_number'),
            $arguments->text('note'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => TaskState::Finished->value]);
    }
}
