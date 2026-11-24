<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Commands\AnswerMessage\AnswerMessageCommand;
use App\Mcp\Attributes\Dispatches;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('messages_answer')]
#[Dispatches(AnswerMessageCommand::class)]
#[Description('Close a waiting message from your inbox with a durable reply you wrote.')]
final class AnswerMessageTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'message_id' => $this->recordIdArgument($schema),
            'reply_id' => $this->recordIdArgument($schema),
        ];
    }

    protected function command(ToolArguments $arguments): AnswerMessageCommand
    {
        return new AnswerMessageCommand($arguments->ulid('message_id'), $arguments->ulid('reply_id'));
    }

    protected function present(mixed $replyId): ToolResult
    {
        return ToolResult::ok(['reply_id' => $replyId]);
    }
}
