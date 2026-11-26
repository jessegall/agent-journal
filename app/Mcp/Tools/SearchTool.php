<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\CommandRules\Mcp\Tools\JournalReadTool;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\DeclaredSearch;
use App\Mcp\Support\ToolArguments;
use App\Search\Values\SearchRequest;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * The one read-only search tool over every source the domains declare: words with an optional scope and limit, a
 * continuation of an earlier search, or a discovery page of the sources the caller may search.
 */
#[IsReadOnly]
#[Name(DeclaredSearch::TOOL)]
#[Description('Search records and passages.')]
final class SearchTool extends JournalReadTool
{
    public function __construct(private readonly DeclaredSearch $search) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'query' => $schema->string(),
            'within' => $schema->string()->max(200),
            'limit' => $this->wholeNumberArgument($schema, 1, SearchRequest::LIMIT_MAXIMUM),
            'continuation' => $schema->string(),
            'discover' => $schema->boolean(),
            'prefix' => $schema->string()->max(64),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->search->search($arguments);
    }
}
