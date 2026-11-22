<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Memory\Commands\SaveMemory\SaveMemoryCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('memories_create')]
#[Dispatches(SaveMemoryCommand::class)]
#[Description('Save a memory at a weight from 1 to 10.')]
final class SaveMemoryTool extends MemoryWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'text' => $schema->string()->required(),
            'weight' => $schema->integer()->min(1)->max(10)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): SaveMemoryCommand
    {
        return new SaveMemoryCommand($arguments->text('text'), $arguments->positiveInteger('weight', 10));
    }
}
