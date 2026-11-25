<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Enums\CommandRules\ReadView;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Values\ReadRequest;
use Domain\Plans\Support\Mcp\PlanReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(PlanReadResult::TOOL)]
#[Description('Read a plan with its progress, phases, and optionally its brief and notes.')]
final class PlanReadTool extends JournalReadTool
{
    public function __construct(private readonly PlanReadResult $plans) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'plan_id' => $this->recordIdArgument($schema),
            'view' => $this->caseArgument($schema, ReadView::class),
            'continuation' => $schema->string(),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        return $this->recordReadRequest($arguments, PlanReadResult::ID_ARGUMENT);
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->plans->read($arguments->ulid('plan_id'), $arguments);
    }
}
