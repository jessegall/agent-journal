<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\JournalSearch;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Name(JournalSearch::TOOL)]
#[Description('Search visible journal records and page through matches by type.')]
#[IsReadOnly]
final class SearchTool extends JournalReadTool
{
    public function __construct(private readonly JournalSearch $search) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string()->min(2)->max(200),
            'types' => $schema->array()->items($schema->string()->max(64))->max(12),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->search->search($arguments);
    }
}
