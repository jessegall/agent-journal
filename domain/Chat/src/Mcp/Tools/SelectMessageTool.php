<?php

declare(strict_types=1);

namespace Domain\Chat\Mcp\Tools;

use App\Commands\Messages\SelectMessage\SelectMessageCommand;
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
#[Name('messages_select')]
#[Dispatches(SelectMessageCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Select a visible message as the active request for this session.')]
final class SelectMessageTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['message_id' => $this->recordIdArgument($schema)];
    }

    protected function command(ToolArguments $arguments): SelectMessageCommand
    {
        return new SelectMessageCommand($arguments->ulid('message_id'));
    }

    protected function present(mixed $messageId): ToolResult
    {
        return ToolResult::ok(['message_id' => $messageId]);
    }
}
