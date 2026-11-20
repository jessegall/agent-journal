<?php

declare(strict_types=1);

namespace Tests\Fixtures\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

#[Dispatches(WriteNote::class)]
final class DuplicateCommandTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['text' => $schema->string()->required()];
    }

    protected function command(ToolArguments $arguments): WriteNote
    {
        $first = new WriteNote($arguments->text('text'));
        strlen($first->text); // @phpstan-ignore function.resultUnused (the unrelated call the rule must find)

        return new WriteNote($arguments->text('text'));
    }

    protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok(['note_id' => $result]);
    }
}
