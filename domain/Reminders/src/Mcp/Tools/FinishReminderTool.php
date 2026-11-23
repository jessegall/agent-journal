<?php

declare(strict_types=1);

namespace Domain\Reminders\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('reminders_finish')]
#[Dispatches(FinishReminderCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description('Mark one of your open reminders done.')]
final class FinishReminderTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['reminder_id' => $schema->string()->required()];
    }

    protected function command(ToolArguments $arguments): FinishReminderCommand
    {
        return new FinishReminderCommand($arguments->ulid('reminder_id'));
    }

    protected function present(mixed $commandReply): ToolResult
    {
        return ToolResult::ok(['finished' => true]);
    }
}
