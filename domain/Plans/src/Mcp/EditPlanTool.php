<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Api\PlanTextLimit;
use Domain\Plans\Commands\EditPlan;
use Domain\Plans\Enums\PlanType;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('plans_edit')]
#[IsDestructive(false)]
#[Dispatches(EditPlan::class)]
#[Description('Change a plan at the revision you read.')]
final class EditPlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->planRevisionSchema($schema),
            'title' => $schema->string()->max(PlanTextLimit::Title->value),
            'brief' => $schema->string()->max(PlanTextLimit::Brief->value),
            'type' => $this->typeSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): EditPlan
    {
        return new EditPlan(
            $arguments->ulid('plan_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->optionalText('title'),
            $arguments->optionalText('brief'),
            $arguments->optionalEnum('type', PlanType::class),
        );
    }

    protected function present(mixed $revision): ToolResult
    {
        return ToolResult::ok(['revision' => $revision]);
    }
}
