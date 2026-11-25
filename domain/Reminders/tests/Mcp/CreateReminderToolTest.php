<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Mcp;

use Domain\Reminders\Commands\CreateReminder\CreateReminderCommand;
use Domain\Reminders\Mcp\Tools\CreateReminderTool;
use Domain\Reminders\RemindersDomain;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent sets a reminder for a time and is given the reminder.
 */
#[TestsMcpTool(CreateReminderTool::class)]
final class CreateReminderToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        return ToolCall::by($start)
            ->arguments([
                'title' => 'Check the run',
                'due_at' => '2026-12-01T09:00:00+00:00',
                'request_key' => 'write-1',
            ])
            ->reply(CreateReminderCommand::class, (string) Str::ulid())
            ->expects(ExpectedCommand::of(CreateReminderCommand::class, [
                'title' => 'Check the run',
                'dueAt' => '2026-12-01T09:00:00+00:00',
            ]));
    }
}
