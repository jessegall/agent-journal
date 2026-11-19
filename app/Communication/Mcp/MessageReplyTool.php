<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\ReplyToMessage;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('messages_reply')]
#[Description('Reply to a message at the state version you read; a question is answered by it.')]
final class MessageReplyTool extends MessageWriteTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'state_version' => $schema->integer()->min(0)->required(),
            'body' => $schema->string()->required(),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
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
