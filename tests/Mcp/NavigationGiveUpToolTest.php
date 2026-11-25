<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\NavigationGiveUpTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool NavigationGiveUpTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(NavigationGiveUpTool::class)]
final class NavigationGiveUpToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('NavigationGiveUpTool', [
            'the argument request',
            'the argument version',
            'the argument reason',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
