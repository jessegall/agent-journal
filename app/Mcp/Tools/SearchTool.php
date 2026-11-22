<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Contracts\SearchEntry;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\JournalSearch;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * The one read-only search tool; what it searches, its arguments and its description come from the search entry
 * the configuration chose.
 */
#[IsReadOnly]
#[Name(JournalSearch::TOOL)]
final class SearchTool extends JournalReadTool
{
    public function __construct(private readonly SearchEntry $search) {}

    public function description(): string
    {
        return $this->search->description();
    }

    public function schema(JsonSchema $schema): array
    {
        return $this->search->schema($schema);
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->search->search($arguments);
    }
}
