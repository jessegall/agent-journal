<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MessageSendTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool MessageSendTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(MessageSendTool::class)]
final class MessageSendToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('MessageSendTool', [
            'the argument inbox_id',
            'the argument body',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
