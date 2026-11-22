<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Mcp\Concerns\PublicationArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('docs_close')]
#[IsDestructive(false)]
#[Dispatches(CloseDocumentCommand::class)]
#[Description('Close an edit and publish a revision if its text changed.')]
final class CloseDocumentTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'edit_id' => $schema->string()->max(64)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CloseDocumentCommand
    {
        return new CloseDocumentCommand($this->target($arguments));
    }

    protected function present(mixed $publication): ToolResult
    {
        return ToolResult::ok([
            'revision' => $publication->revisionNumber,
            'published' => $publication->published,
        ]);
    }
}
