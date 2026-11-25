<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Commands\Messages\DeliverClosingWords\DeliverClosingWordsCommand;
use App\Contracts\Bus\Command;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('closing_words_deliver')]
#[Dispatches(DeliverClosingWordsCommand::class)]
#[Description('Deliver the closing words you stopped with as a message, into the inbox of the message you read last.')]
final class ClosingWordsDeliverTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new DeliverClosingWordsCommand();
    }

    protected function payload(mixed $messageId): array
    {
        return ['message_id' => $messageId];
    }
}
