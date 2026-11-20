<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Memory\Commands\RemoveMemory;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('memories_remove')]
#[Dispatches(RemoveMemory::class)]
#[Description('Remove one of your memories.')]
final class RemoveMemoryTool extends MemoryWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'memory_id' => $schema->string()->max(26)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): RemoveMemory
    {
        return new RemoveMemory($arguments->ulid('memory_id'));
    }
}
