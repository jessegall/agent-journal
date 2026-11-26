<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('plans_assign_work')]
#[Dispatches(AssignPlanWorkCommand::class)]
#[Description('Give a plan or phase and all of its unfinished work to an eligible recipient.')]
final class AssignPlanWorkTool extends PlanCascadeTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'root' => $this->rootSchema($schema),
            'recipient' => $this->assigneeSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): AssignPlanWorkCommand
    {
        return new AssignPlanWorkCommand($this->root($arguments), $this->recipient($arguments));
    }
}
