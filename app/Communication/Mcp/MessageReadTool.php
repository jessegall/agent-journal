<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\ReadMessages;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('messages_read')]
#[Description('Read messages in one of your inboxes; the first reader of a question takes it up.')]
final class MessageReadTool extends MessageWriteTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'message_ids' => $schema->array()->items($schema->string()->max(26))->required(),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReadMessages(
            $arguments->text('inbox_id'),
            $arguments->list('message_ids'),
        );
    }

    protected function payload(mixed $result): array
    {
        return ['results' => $result->results];
    }
}
