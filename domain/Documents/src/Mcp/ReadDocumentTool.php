<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Enums\PublicationView;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('docs_read')]
#[Description('Read a document summary, body range, revisions or comments.')]
final class ReadDocumentTool extends PublicationReadTool
{
    public function __construct(private readonly DocumentReader $documents) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'view' => $schema->string()->enum(array_column(PublicationView::cases(), 'value')),
            'revision' => $schema->integer()->min(1),
            ...$this->rangeSchema($schema),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return $this->documents->document($arguments->recordReference('doc_id'), $arguments);
    }
}
