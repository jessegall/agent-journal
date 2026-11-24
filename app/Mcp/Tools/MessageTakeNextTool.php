<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Commands\TakeNextMessages\TakeNextMessagesCommand;
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
#[Name('messages_take_next')]
#[Dispatches(TakeNextMessagesCommand::class)]
#[Description('Claim the oldest questions nobody has claimed in one of your inboxes.')]
final class MessageTakeNextTool extends MessageWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'inbox_id' => $this->recordIdArgument($schema),
            'limit' => $this->wholeNumberArgument($schema, 1, 100),
        ];
    }

    protected function command(ToolArguments $arguments): Command
    {
        return new TakeNextMessagesCommand(
            $arguments->text('inbox_id'),
            $arguments->positiveIntegerOr('limit', 1, TakeNextMessagesCommand::LARGEST_LIMIT),
        );
    }

    protected function payload(mixed $readBatch): array
    {
        return ['results' => $readBatch->messageReads];
    }
}
