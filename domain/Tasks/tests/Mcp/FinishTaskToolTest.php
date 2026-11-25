<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Mcp\Tools\FinishTaskTool;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool FinishTaskTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(FinishTaskTool::class)]
final class FinishTaskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('FinishTaskTool', [
            'the argument task_id',
            'the argument run_number',
            'the argument note',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
