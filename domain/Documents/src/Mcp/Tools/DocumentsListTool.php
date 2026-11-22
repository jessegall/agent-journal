<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Support\Mcp\PublicationLists;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('docs_list')]
#[Description('List published documents by search and page.')]
final class DocumentsListTool extends PublicationReadTool
{
    public function __construct(private readonly PublicationLists $publications) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'search' => $schema->string()->max(200),
            'page' => $schema->integer()->min(1),
            'continuation' => $schema->string(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->publications->documents($arguments);
    }
}
