<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\AskMessage\AskMessageCommand;
use App\Contracts\Bus\Command;
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
#[Name('messages_ask')]
#[IsDestructive(false)]
#[Dispatches(AskMessageCommand::class)]
#[Description('Ask a question from one of your inboxes to another inbox; it waits until someone there answers.')]
final class MessageAskTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'source_inbox_id' => $this->recordIdArgument($schema),
            'destination_inbox_id' => $this->recordIdArgument($schema),
            'body' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new AskMessageCommand(
            $arguments->text('source_inbox_id'),
            $arguments->text('destination_inbox_id'),
            $arguments->text('body'),
        );
    }

    protected function payload(mixed $messageId): array
    {
        return ['message_id' => $messageId];
    }
}
