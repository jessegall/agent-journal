<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Chat\Commands\React\ReactCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Name(self::NAME)]
#[IsIdempotent(false)]
#[IsDestructive(false)]
#[Dispatches(ReactCommand::class)]
#[Description('React to a message with one emoji: a reply to it whose whole body is that emoji.')]
final class MessageReactionTool extends JournalWriteTool
{
    public const string NAME = 'messages_react';

    /**
     * The most characters an emoji with its modifiers takes.
     */
    private const int EMOJI_CHARACTER_LIMIT = 32;

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $this->recordIdArgument($schema),
            'emoji' => $schema->string()->max(self::EMOJI_CHARACTER_LIMIT)->required(),
        ];
    }

    protected function command(ToolArguments $arguments): ReactCommand
    {
        return new ReactCommand($arguments->ulid('message_id'), $arguments->text('emoji'));
    }

    protected function present(mixed $messageId): ToolResult
    {
        return ToolResult::ok(['message_id' => $messageId]);
    }
}
