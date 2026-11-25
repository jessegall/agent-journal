<?php

declare(strict_types=1);

namespace Domain\Reminders\Tests\Mcp;

use Domain\Reminders\Mcp\Tools\CreateReminderTool;
use Domain\Reminders\RemindersDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool CreateReminderTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(CreateReminderTool::class)]
final class CreateReminderToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RemindersDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('CreateReminderTool', [
            'the argument title',
            'the argument due_at',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
