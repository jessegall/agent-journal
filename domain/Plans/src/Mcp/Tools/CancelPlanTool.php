<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\CancelPlan\CancelPlanCommand;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[VisibleToProfiles]
#[Name('plans_cancel')]
#[Dispatches(CancelPlanCommand::class)]
#[Description('Cancel a plan with a reason. Its tasks remain.')]
final class CancelPlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->planRevisionSchema($schema),
            'reason' => $schema->string()->max(PlanTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CancelPlanCommand
    {
        return new CancelPlanCommand(
            $arguments->ulid('plan_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->text('reason'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => PlanState::Cancelled->value]);
    }
}
