<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Documents\Commands\RecoverDraft\RecoverDraftCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('docs_drafts_recover')]
#[Dispatches(RecoverDraftCommand::class)]
#[Description('Open an authorized saved draft as a new private edit.')]
final class RecoverDraftTool extends DraftWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'draft_id' => $this->recordIdArgument($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): RecoverDraftCommand
    {
        return new RecoverDraftCommand($arguments->ulid('draft_id'), $arguments->positiveInteger('expected_revision'));
    }
}
