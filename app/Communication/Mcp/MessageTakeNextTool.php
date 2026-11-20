<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\TakeNextMessages;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[VisibleToProfiles]
#[IsDestructive(false)]
#[Name('messages_take_next')]
#[Dispatches(TakeNextMessages::class)]
#[Description('Take up the oldest questions nobody has taken up in one of your inboxes.')]
final class MessageTakeNextTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'limit' => $schema->integer()->min(1)->max(100),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new TakeNextMessages(
            $arguments->text('inbox_id'),
            $arguments->positiveIntegerOr('limit', 1, TakeNextMessages::LARGEST_LIMIT),
        );
    }

    protected function payload(mixed $readBatch): array
    {
        return ['results' => $readBatch->messageReads];
    }
}
