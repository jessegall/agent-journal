<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Mcp\Tools\RunTaskCheckTool;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool RunTaskCheckTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(RunTaskCheckTool::class)]
final class RunTaskCheckToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('RunTaskCheckTool', [
            'the argument task_id',
            'the argument run_number',
            'the argument process_run_id',
            'the argument operation',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
