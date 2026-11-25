<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\AssignRecordTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool AssignRecordTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(AssignRecordTool::class)]
final class AssignRecordToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('AssignRecordTool', [
            'the argument record_type',
            'the argument record_id',
            'the argument recipient',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
