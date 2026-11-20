<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Commands\EditDocument;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name('docs_edit')]
#[Description('Replace one section of an open edit using text or one sealed upload.')]
#[IsDestructive(true)]
#[IsIdempotent]
#[Dispatches(EditDocument::class)]
final class EditDocumentTool extends DraftWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'doc_id' => $this->referenceSchema($schema),
            'edit_id' => $schema->string()->max(64)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'section' => $schema->string()->max(240)->required(),
            'body' => $schema->string(),
            'upload_id' => $schema->string()->max(26),
        ];
    }

    protected function command(ToolArguments $arguments): EditDocument
    {
        return new EditDocument(
            $this->target($arguments, $arguments->positiveInteger('expected_revision')),
            $arguments->text('section'),
            $arguments->optionalText('body'),
            $arguments->optionalUlid('upload_id'),
        );
    }
}
