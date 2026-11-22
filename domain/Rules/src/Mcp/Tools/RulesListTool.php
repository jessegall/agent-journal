<?php

declare(strict_types=1);

namespace Domain\Rules\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Rules\Enums\RuleState;
use Domain\Rules\Support\Mcp\RulesListResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name(RulesListResult::TOOL)]
#[Description('List rules by state, defaulting to the active rules.')]
final class RulesListTool extends JournalReadTool
{
    public function __construct(private readonly RulesListResult $rules) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'state' => $schema->string()->enum(array_column(RuleState::cases(), 'value')),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->rules->read($arguments);
    }
}
