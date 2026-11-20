<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Mcp\Attributes\WritesCommand;
use App\Bus\Contracts\Command;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\AskMessage;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('messages_ask')]
#[WritesCommand(AskMessage::class)]
#[Description('Ask a question from one of your inboxes to another inbox; it waits until someone there answers.')]
final class MessageAskTool extends MessageWriteTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'source_inbox_id' => $schema->string()->max(26)->required(),
            'destination_inbox_id' => $schema->string()->max(26)->required(),
            'body' => $schema->string()->required(),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new AskMessage(
            $arguments->text('source_inbox_id'),
            $arguments->text('destination_inbox_id'),
            $arguments->text('body'),
        );
    }

    protected function payload(mixed $result): array
    {
        return ['message_id' => $result];
    }
}
