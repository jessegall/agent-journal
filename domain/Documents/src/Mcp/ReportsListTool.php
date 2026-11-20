<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Enums\ReportState;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name('reports_list')]
#[Description('List reports by state, search and page.')]
#[IsReadOnly]
final class ReportsListTool extends PublicationReadTool
{
    public function __construct(private readonly PublicationLists $publications) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(200),
            'state' => $schema->string()->enum(array_column(ReportState::cases(), 'value')),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->publications->reports($arguments);
    }
}
