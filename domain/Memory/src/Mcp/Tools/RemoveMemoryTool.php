<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Memory\Commands\RemoveMemory\RemoveMemoryCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('memories_remove')]
#[Dispatches(RemoveMemoryCommand::class)]
#[Description('Remove one of your memories.')]
final class RemoveMemoryTool extends MemoryWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'memory_id' => $this->recordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): RemoveMemoryCommand
    {
        return new RemoveMemoryCommand($arguments->ulid('memory_id'));
    }
}
