<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp;

use App\Agents\Values\ReadRequest;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Reads\Enums\ReadView;
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
            'plan_id' => $schema->string()->max(26)->required(),
            'view' => $schema->string()->enum(array_column(ReadView::cases(), 'value')),
            'continuation' => $schema->string(),
        ];
    }

    public function readRequest(ToolArguments|null $arguments = null): ReadRequest
    {
        if ($arguments === null) {
            return parent::readRequest();
        }

        return new ReadRequest($this->name(), arguments: ['plan_id' => $arguments->ulid('plan_id')]);
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->plans->read($arguments->ulid('plan_id'), $arguments);
    }
}
