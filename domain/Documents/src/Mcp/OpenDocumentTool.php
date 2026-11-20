<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Commands\OpenDocument;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name('docs_open')]
#[Description('Open an exclusive edit on the expected document revision.')]
#[IsDestructive(false)]
#[IsIdempotent]
#[Dispatches(OpenDocument::class)]
final class OpenDocumentTool extends DraftWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): OpenDocument
    {
        return new OpenDocument(
            $arguments->recordReference('doc_id'),
            $arguments->positiveInteger('expected_revision'),
        );
    }
}
