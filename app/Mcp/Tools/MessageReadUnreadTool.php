<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\Messages\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Contracts\Bus\Command;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_read_unread')]
#[Dispatches(ReadUnreadMessagesCommand::class)]
#[Description('Read every message of your inboxes you have not read yet, oldest first.')]
final class MessageReadUnreadTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReadUnreadMessagesCommand();
    }

    protected function payload(mixed $messages): array
    {
        return ['messages' => $messages];
    }
}
