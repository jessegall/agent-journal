<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp;

use App\Communication\Commands\ReplyToMessage;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_reply')]
#[Dispatches(ReplyToMessage::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper, DiscoveryProfile::ReadOnlyHelper)]
#[Description('Reply to a message. A waiting question is answered. Optionally require the state version you read.')]
final class ReplyToMessageTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $schema->string()->max(26)->required(),
            'state_version' => $schema->integer()->min(0),
            'body' => $schema->string()->required(),
        ];
    }

    protected function command(ToolArguments $arguments): ReplyToMessage
    {
        return new ReplyToMessage(
            $arguments->ulid('message_id'),
            $arguments->optionalWholeNumber('state_version'),
            $arguments->text('body'),
        );
    }

    protected function present(mixed $messageId): ToolResult
    {
        return ToolResult::ok(['message_id' => $messageId]);
    }
}
