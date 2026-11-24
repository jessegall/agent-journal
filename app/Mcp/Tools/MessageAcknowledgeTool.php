<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\Messages\ReadMessages\ReadMessagesCommand;
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
#[IsDestructive(false)]
#[Name('messages_acknowledge')]
#[Dispatches(ReadMessagesCommand::class)]
#[Description('Mark inbox messages as read and claim any unanswered questions.')]
final class MessageAcknowledgeTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'message_ids' => $schema->array()->items($this->optionalRecordIdArgument($schema))->required(),
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
