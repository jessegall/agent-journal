<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('docs_open')]
#[IsDestructive(false)]
#[Dispatches(OpenDocumentCommand::class)]
#[Description('Open an exclusive edit on the expected document revision.')]
final class OpenDocumentTool extends DraftWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): OpenDocumentCommand
    {
        return new OpenDocumentCommand(
            (string) $arguments->recordReference('doc_id'),
            $arguments->positiveInteger('expected_revision'),
        );
    }
}
