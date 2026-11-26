<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MessageSendTool;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent sends a message into its inbox: the tool sends the one send command and names the message it made.
 */
#[TestsMcpTool(MessageSendTool::class)]
final class MessageSendToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $journal->sharedInbox('Owner', 'Planner');
        $inbox = $journal->sharedInboxOf('Owner', 'Planner');

        return ToolCall::by($start)
            ->arguments(['inbox_id' => $inbox->id, 'body' => 'Half way.', 'request_key' => 'send-1'])
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(SendMessageCommand::class, ['inboxId' => $inbox->id, 'body' => 'Half way.']);
    }
}
