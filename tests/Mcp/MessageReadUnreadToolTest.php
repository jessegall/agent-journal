<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MessageReadUnreadTool;
use App\Messages\Commands\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Messages\ShownMessage;
use App\Messages\ShownMessages;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads every message it has not read yet: the tool sends the one read command and shows them oldest first.
 */
#[TestsMcpTool(MessageReadUnreadTool::class)]
final class MessageReadUnreadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $journal->sharedInbox('Owner', 'Planner');
        $message = $journal->post('Owner', $journal->sharedInboxOf('Owner', 'Planner'), 'How far are you?');

        return ToolCall::by($start)
            ->arguments(['request_key' => 'unread-1'])
            ->reply(ReadUnreadMessagesCommand::class, new ShownMessages([ShownMessage::of($message)]))
            ->expects(ReadUnreadMessagesCommand::class);
    }
}
