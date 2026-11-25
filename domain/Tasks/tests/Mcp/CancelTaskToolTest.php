<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Mcp\Tools\CancelTaskTool;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool CancelTaskTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(CancelTaskTool::class)]
final class CancelTaskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('CancelTaskTool', [
            'the argument task_id',
            'the argument reason',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
