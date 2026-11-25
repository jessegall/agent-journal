<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\OperationsReadTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool OperationsReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(OperationsReadTool::class)]
final class OperationsReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('OperationsReadTool', [
            'the argument request_key',
        ]);
    }
}
