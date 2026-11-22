<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Enums\PlanState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('plans_start')]
#[IsDestructive(false)]
#[Dispatches(StartPlanCommand::class)]
#[Description('Start a plan that is ready to run.')]
final class StartPlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'plan_id' => $schema->string()->max(26)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): StartPlanCommand
    {
        return new StartPlanCommand($arguments->ulid('plan_id'));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => PlanState::Started->value]);
    }
}
