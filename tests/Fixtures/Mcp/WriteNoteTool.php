<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;

#[IsIdempotent]
#[Name('write_note')]
#[IsDestructive(false)]
#[Description('Write a note.')]
#[Dispatches(WriteNoteCommand::class)]
final class WriteNoteTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['text' => $schema->string()->required()];
    }

    protected function command(ToolArguments $arguments): WriteNoteCommand
    {
        return new WriteNoteCommand($arguments->text('text'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['note_id' => $result]);
    }
}
