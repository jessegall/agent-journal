<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\FinishPlan\FinishPlanCommand;
use Domain\Plans\Enums\PlanStatus;
use Domain\Plans\Enums\PlanTextLimit;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('plans_finish')]
#[Dispatches(FinishPlanCommand::class)]
#[Description('Finish a started plan when all its tasks have ended.')]
final class FinishPlanTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            ...$this->planRevisionSchema($schema),
            'note' => $schema->string()->max(PlanTextLimit::Note->value)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): FinishPlanCommand
    {
        return new FinishPlanCommand(
            $arguments->ulid('plan_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->text('note'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['state' => PlanStatus::Done->value]);
    }
}
