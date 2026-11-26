<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[Name('docs_edit')]
#[IsDestructive(true)]
#[Dispatches(EditDocumentCommand::class)]
#[Description('Replace one section of an open edit using text or one sealed upload.')]
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
            'upload_id' => $this->optionalRecordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): EditDocumentCommand
    {
        return new EditDocumentCommand(
            $this->target($arguments, $arguments->positiveInteger('expected_revision')),
            $arguments->text('section'),
            $arguments->optionalText('body'),
            $arguments->optionalUlid('upload_id'),
        );
    }
}
