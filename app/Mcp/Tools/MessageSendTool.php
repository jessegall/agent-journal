<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\Command;
use App\Attributes\Bus\Dispatches;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_send')]
#[Dispatches(SendMessageCommand::class)]
#[Description('Send a message into an inbox you are attached to; name target_message_number to reply to that message of the inbox.')]
final class MessageSendTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'body' => $schema->string()->required(),
            'target_message_number' => $schema->integer()->min(1),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new SendMessageCommand(
            $arguments->text('inbox_id'),
            $arguments->text('body'),
            $arguments->optionalPositiveInteger('target_message_number'),
        );
    }

    protected function payload(mixed $messageId): array
    {
        return ['message_id' => $messageId];
    }
}
