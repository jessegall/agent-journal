<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\ReplyToMessage;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_reply')]
#[Dispatches(ReplyToMessage::class, readOnlyHelper: true)]
#[Description('Reply to a message at the state version you read; a question is answered by it.')]
final class MessageReplyTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'state_version' => $schema->integer()->min(0)->required(),
            'body' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReplyToMessage(
            $arguments->text('message_id'),
            $arguments->wholeNumber('state_version'),
            $arguments->text('body'),
        );
    }

    protected function payload(mixed $result): array
    {
        return ['message_id' => $result];
    }
}
