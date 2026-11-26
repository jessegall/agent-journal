<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\MessageReadTool;
use App\Messages\Commands\ReadMessage\ReadMessageCommand;
use App\Messages\ShownMessage;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one message of its inbox: the tool sends the one read command and shows the message it answers.
 */
#[TestsMcpTool(MessageReadTool::class)]
final class MessageReadToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $journal->sharedInbox('Owner', 'Planner');
        $message = $journal->post('Owner', $journal->sharedInboxOf('Owner', 'Planner'), 'How far are you?');

        return ToolCall::by($start)
            ->arguments(['message_id' => $message->id, 'request_key' => 'read-1'])
            ->reply(ReadMessageCommand::class, ShownMessage::of($message))
            ->expects(ReadMessageCommand::class, ['messageId' => $message->id]);
    }
}
