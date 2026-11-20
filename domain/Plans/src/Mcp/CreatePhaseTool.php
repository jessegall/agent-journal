<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Api\PlanTextLimits;
use Domain\Plans\Commands\AddPhase;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('phases_create')]
#[Dispatches(AddPhase::class)]
#[Description('Add a phase after the last phase of a plan.')]
final class CreatePhaseTool extends PlanWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'plan_id' => $schema->string()->max(26)->required(),
            'title' => $schema->string()->max(PlanTextLimits::TITLE)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): AddPhase
    {
        return new AddPhase($arguments->ulid('plan_id'), $arguments->text('title'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['phase_id' => $result]);
    }
}
