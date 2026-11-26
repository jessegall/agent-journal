<?php

declare(strict_types=1);

namespace Domain\Reminders\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Reminders\Commands\CreateReminder\CreateReminderCommand;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive(false)]
#[Name('reminders_create')]
#[Dispatches(CreateReminderCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
#[Description('Make a reminder for yourself: what to do, and the date and time it is due.')]
final class CreateReminderTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'title' => $schema->string()->required(),
            'due_at' => $schema->string()
                ->description('The date and time it is due, such as 2026-11-24 09:00')
                ->required(),
        ];
    }

    protected function command(ToolArguments $arguments): CreateReminderCommand
    {
        return new CreateReminderCommand($arguments->text('title'), $arguments->text('due_at'));
    }

    protected function present(mixed $commandReply): ToolResult
    {
        return ToolResult::ok(['reminder_id' => $commandReply]);
    }
}
