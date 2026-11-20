<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Commands\CommentOnDocument;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name('docs_comment')]
#[Description('Add an attributed comment to a document.')]
#[IsDestructive(false)]
#[IsIdempotent]
#[Dispatches(CommentOnDocument::class)]
final class CommentOnDocumentTool extends JournalWriteTool
{
    use PublicationArguments;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'body' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CommentOnDocument
    {
        return new CommentOnDocument($arguments->recordReference('doc_id'), $arguments->text('body'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['comment_id' => $result]);
    }
}
