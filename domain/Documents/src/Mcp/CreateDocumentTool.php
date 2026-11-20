<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('docs_create')]
#[IsDestructive(false)]
#[Dispatches(CreateDocument::class)]
#[Description('Publish a document from text or one sealed upload.')]
final class CreateDocumentTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->max(240)->required(),
            'abstract' => $schema->string()->max(1000)->required(),
            'body' => $schema->string(),
            'upload_id' => $schema->string()->max(26),
            'source_references' => $schema->array()->items($schema->string()->max(128))->max(50),
        ];
    }

    protected function command(ToolArguments $arguments): CreateDocument
    {
        return new CreateDocument(
            $arguments->text('title'),
            $arguments->text('abstract'),
            $arguments->optionalText('body'),
            $this->sources($arguments),
            $arguments->optionalUlid('upload_id'),
        );
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok([
            'doc_id' => $result->number,
            'document_id' => $result->id,
            'revision' => $result->revision,
        ]);
    }
}
