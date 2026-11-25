<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Contracts\Bus\Command;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_read')]
#[Dispatches(ReadMessageCommand::class)]
#[Description('Read one message of an inbox you are attached to; reading it is what lets you answer it.')]
final class MessageReadTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['message_id' => $this->recordIdArgument($schema)];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReadMessageCommand($arguments->text('message_id'));
    }

    protected function payload(mixed $message): array
    {
        return ['message' => $message];
    }
}
