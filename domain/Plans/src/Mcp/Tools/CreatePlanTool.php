<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Projects\ProjectDestination;
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
use PhpOption\None;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('plans_create')]
#[Dispatches(CreatePlanCommand::class)]
#[Description('Create a plan with a title, brief, and type.')]
final class CreatePlanTool extends PlanWriteTool
{
    public function __construct(private readonly ProjectDestination $destination) {}

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
            $this->projectId(),
        );
    }

    protected function present(mixed $planId): ToolResult
    {
        return ToolResult::ok(['plan_id' => $planId]);
    }

    /**
     * The calling agent's project, which the plan belongs to.
     */
    private function projectId(): string
    {
        return $this->destination->projectFor(None::create());
    }
}
