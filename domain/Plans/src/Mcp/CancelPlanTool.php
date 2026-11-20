<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Api\PlanTextLimits;
use Domain\Plans\Commands\CancelPlan;
use Domain\Plans\Enums\PlanState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('plans_cancel')]
#[Dispatches(CancelPlan::class)]
#[Description('Cancel a plan with a reason. Its tasks remain.')]
#[VisibleToProfiles]
final class CancelPlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->planRevisionSchema($schema),
            'reason' => $schema->string()->max(PlanTextLimits::NOTE)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CancelPlan
    {
        return new CancelPlan(
            $arguments->ulid('plan_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->text('reason'),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['state' => PlanState::Cancelled->value]);
    }
}
