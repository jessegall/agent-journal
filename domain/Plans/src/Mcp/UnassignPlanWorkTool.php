<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\UnassignPlanWork;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('plans_unassign_work')]
#[Dispatches(UnassignPlanWork::class)]
#[Description('Release a plan or phase and its unfinished work using the root assignment reference you read.')]
final class UnassignPlanWorkTool extends PlanCascadeTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['root' => $this->rootSchema($schema), 'expected_assignment' => $this->expectedSchema($schema)];
    }

    protected function command(ToolArguments $arguments): UnassignPlanWork
    {
        return new UnassignPlanWork($this->root($arguments), $this->expected($arguments));
    }
}
