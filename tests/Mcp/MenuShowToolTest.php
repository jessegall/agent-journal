<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MenuShowTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool MenuShowTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(MenuShowTool::class)]
final class MenuShowToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('MenuShowTool', [
            'the argument entry',
        ]);
    }
}
