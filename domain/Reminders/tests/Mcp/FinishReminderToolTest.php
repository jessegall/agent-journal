<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Mcp;

use Domain\Reminders\Mcp\Tools\FinishReminderTool;
use Domain\Reminders\RemindersDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool FinishReminderTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(FinishReminderTool::class)]
final class FinishReminderToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('FinishReminderTool', [
            'the argument reminder_id',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
