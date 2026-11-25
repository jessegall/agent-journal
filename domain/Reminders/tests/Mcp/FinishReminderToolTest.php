<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Mcp;

use Carbon\CarbonImmutable;
use Domain\Reminders\Commands\FinishReminder\FinishReminderCommand;
use Domain\Reminders\Mcp\Tools\FinishReminderTool;
use Domain\Reminders\RemindersDomain;
use Domain\Reminders\Tests\Fixtures\ReminderFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent finishes one of its reminders.
 */
#[TestsMcpTool(FinishReminderTool::class)]
final class FinishReminderToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $reminder = $journal->fixtures(ReminderFixtures::class)
            ->createReminder('Check', 'Builder', CarbonImmutable::now()->addHour());

        return ToolCall::by($start)
            ->arguments([
                'reminder_id' => $reminder->id,
                'request_key' => 'write-1',
            ])
            ->expects(FinishReminderCommand::class, ['reminderId' => $reminder->id]);
    }
}
