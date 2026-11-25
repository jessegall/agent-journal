<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\OutputsReadTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool OutputsReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(OutputsReadTool::class)]
final class OutputsReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('OutputsReadTool', [
            'the argument run',
            'the argument part',
            'the argument stream',
        ]);
    }
}
