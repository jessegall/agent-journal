<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MessageReadTool;
use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of the tool MessageReadTool, as the generator wrote it.
 */
#[Generated]
#[TestsMcpTool(MessageReadTool::class)]
final class MessageReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        throw EntryTestNeedsArrangement::for('MessageReadTool', [
            'the argument message_id',
            'the argument request_key',
            'the expected commands',
            'the sink replies',
        ]);
    }
}
