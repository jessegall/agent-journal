<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Projects\Contracts\ProjectDestination;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Support\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use PhpOption\None;

#[IsIdempotent]
#[Name('docs_create')]
#[IsDestructive(false)]
#[Dispatches(CreateDocumentCommand::class)]
#[Description('Publish a document from text or one sealed upload.')]
final class CreateDocumentTool extends JournalWriteTool
{
    use PublicationArguments;

    public function __construct(private readonly ProjectDestination $destination) {}

    protected function writeSchema(JsonSchema $schema): array
    {
        return $this->newPublicationSchema($schema);
    }

    protected function command(ToolArguments $arguments): CreateDocumentCommand
    {
        return new CreateDocumentCommand(
            $arguments->text('title'),
            $arguments->text('abstract'),
            $arguments->optionalText('body'),
            $this->ownerKey(),
            $this->sources($arguments),
            $arguments->optionalUlid('upload_id'),
        );
    }

    protected function present(mixed $document): ToolResult
    {
        return ToolResult::ok([
            'doc_id' => $document->number,
            'document_id' => $document->id,
            'revision' => $document->revision,
        ]);
    }

    /**
     * The key of the calling agent's project, which the document belongs to.
     */
    private function ownerKey(): string
    {
        return $this->destination->ownerFor(None::create())->key();
    }
}
