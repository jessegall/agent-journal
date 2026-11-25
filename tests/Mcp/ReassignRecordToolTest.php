<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\ReassignRecordTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool ReassignRecordTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(ReassignRecordTool::class)]
final class ReassignRecordToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('ReassignRecordTool', [
            'the argument record_type',
            'the argument record_id',
            'the argument expected_assignment',
            'the argument recipient',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
