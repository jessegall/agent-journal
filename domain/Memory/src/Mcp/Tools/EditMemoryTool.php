<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Domain\Memory\Commands\EditMemory\EditMemoryCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('memories_edit')]
#[Dispatches(EditMemoryCommand::class)]
#[Description('Edit your memory at the revision you read.')]
final class EditMemoryTool extends MemoryWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'memory_id' => $this->recordIdArgument($schema),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'text' => $schema->string(),
            'weight' => $this->wholeNumberArgument($schema, 1, 10),
        ];
    }

    protected function command(ToolArguments $arguments): EditMemoryCommand
    {
        return new EditMemoryCommand(
            $arguments->ulid('memory_id'),
            $arguments->positiveInteger('expected_revision'),
            $arguments->optionalText('text'),
            $arguments->optionalWholeNumber('weight'),
        );
    }
}
