<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\UnassignRecordTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool UnassignRecordTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(UnassignRecordTool::class)]
final class UnassignRecordToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('UnassignRecordTool', [
            'the argument record_type',
            'the argument record_id',
            'the argument expected_assignment',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
