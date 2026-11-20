<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\AddPhaseTasks;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('phases_add_tasks')]
#[Dispatches(AddPhaseTasks::class)]
#[Description('Append tasks in order to a phase at the revision you read.')]
final class AddPhaseTasksTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'phase_id' => $schema->string()->max(26)->required(),
            'task_ids' => $schema->array()
                ->items($schema->string()->max(26))
                ->min(1)
                ->max(AddPhaseTasks::MAX_TASKS)
                ->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): AddPhaseTasks
    {
        return new AddPhaseTasks(
            $arguments->ulid('phase_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->ulids('task_ids'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok([]);
    }
}
