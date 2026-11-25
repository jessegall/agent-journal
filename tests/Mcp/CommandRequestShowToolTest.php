<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\CommandRequestShowTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool CommandRequestShowTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(CommandRequestShowTool::class)]
final class CommandRequestShowToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('CommandRequestShowTool', [
            'the argument request',
        ]);
    }
}
