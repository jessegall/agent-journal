<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\AddPhase\AddPhaseCommand;
use Domain\Plans\Enums\PlanTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('phases_create')]
#[Dispatches(AddPhaseCommand::class)]
#[Description('Add a phase after the last phase of a plan.')]
final class CreatePhaseTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'plan_id' => $this->recordIdArgument($schema),
            'title' => $schema->string()->max(PlanTextLimit::Title->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): AddPhaseCommand
    {
        return new AddPhaseCommand($arguments->ulid('plan_id'), $arguments->text('title'));
    }

    protected function present(mixed $phaseId): ToolResult
    {
        return ToolResult::ok(['phase_id' => $phaseId]);
    }
}
