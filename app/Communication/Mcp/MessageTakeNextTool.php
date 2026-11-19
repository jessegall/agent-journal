<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\TakeNextMessages;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

#[Name('messages_take_next')]
#[Description('Take up the oldest questions nobody has taken up in one of your inboxes.')]
final class MessageTakeNextTool extends MessageWriteTool
{
    public function schema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'limit' => $schema->integer()->min(1)->max(100),
            'request_key' => $schema->string()->max(RequestKey::LONGEST)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new TakeNextMessages(
            $arguments->text('inbox_id'),
            $arguments->positiveIntegerOr('limit', 1, TakeNextMessages::LARGEST_LIMIT),
        );
    }

    protected function payload(mixed $result): array
    {
        return ['results' => $result->results];
    }
}
