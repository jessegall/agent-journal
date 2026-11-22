<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\ReadMessages\ReadMessagesCommand;
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
#[IsDestructive(false)]
#[Name('messages_acknowledge')]
#[Dispatches(ReadMessagesCommand::class)]
#[Description('Mark inbox messages as read and take up any unanswered questions.')]
final class MessageAcknowledgeTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $schema->string()->max(26)->required(),
            'message_ids' => $schema->array()->items($schema->string()->max(26))->required(),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new ReadMessagesCommand(
            $arguments->text('inbox_id'),
            $arguments->list('message_ids'),
        );
    }

    protected function payload(mixed $read): array
    {
        return ['results' => $read->messageReads];
    }
}
