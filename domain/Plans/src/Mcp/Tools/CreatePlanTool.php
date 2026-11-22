<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\CreatePlan\CreatePlanCommand;
use Domain\Plans\Enums\PlanTextLimit;
use Domain\Plans\Enums\PlanType;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('plans_create')]
#[Dispatches(CreatePlanCommand::class)]
#[Description('Create a plan with a title, brief, and type.')]
final class CreatePlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->max(PlanTextLimit::Title->value)->required(),
            'brief' => $schema->string()->max(PlanTextLimit::Brief->value)->required(),
            'type' => $this->typeSchema($schema)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CreatePlanCommand
    {
        return new CreatePlanCommand(
            $arguments->text('title'),
            $arguments->text('brief'),
            $arguments->enum('type', PlanType::class),
        );
    }

    protected function present(mixed $planId): ToolResult
    {
        return ToolResult::ok(['plan_id' => $planId]);
    }
}
