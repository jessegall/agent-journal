<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\NavigationDoneTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool NavigationDoneTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(NavigationDoneTool::class)]
final class NavigationDoneToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('NavigationDoneTool', [
            'the argument request',
            'the argument version',
            'the argument completes',
            'the argument proof',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
