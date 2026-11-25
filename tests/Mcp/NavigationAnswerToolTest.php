<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\NavigationAnswerTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool NavigationAnswerTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(NavigationAnswerTool::class)]
final class NavigationAnswerToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('NavigationAnswerTool', [
            'the argument request',
            'the argument version',
            'the argument generation',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
