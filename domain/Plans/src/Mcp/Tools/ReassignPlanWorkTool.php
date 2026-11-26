<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('plans_reassign_work')]
#[Dispatches(ReassignPlanWorkCommand::class)]
#[Description('Move a plan or phase and its unfinished work using the root assignment reference you read.')]
final class ReassignPlanWorkTool extends PlanCascadeTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'root' => $this->rootSchema($schema),
            'expected_assignment' => $this->expectedSchema($schema),
            'recipient' => $this->assigneeSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): ReassignPlanWorkCommand
    {
        return new ReassignPlanWorkCommand(
            $this->root($arguments),
            $this->expected($arguments),
            $this->recipient($arguments),
        );
    }
}
