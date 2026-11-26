<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\ClosingWordsDeliverTool;
use App\Messages\Commands\DeliverClosingWords\DeliverClosingWordsCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The closing words an agent stopped with go out as a message: the tool sends the one deliver command and names the message it made.
 */
#[TestsMcpTool(ClosingWordsDeliverTool::class)]
final class ClosingWordsDeliverToolTest extends McpToolEntryTestCase
{
    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Planner');
        $journal->sharedInbox('Owner', 'Planner');

        return ToolCall::by($start)
            ->arguments(['request_key' => 'closing-1'])
            ->reply(DeliverClosingWordsCommand::class, Str::ulid())
            ->expects(DeliverClosingWordsCommand::class);
    }
}
