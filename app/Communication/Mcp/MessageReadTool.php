<?php

declare(strict_types=1);

namespace App\Communication\Mcp;

use App\Bus\Contracts\Command;
use App\Communication\Commands\ReadMessages;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_read')]
#[Dispatches(ReadMessages::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
#[Description('Read messages in one of your inboxes; the first reader of a question takes it up.')]
final class MessageReadTool extends MessageWriteTool
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
