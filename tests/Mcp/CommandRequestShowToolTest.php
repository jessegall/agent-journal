<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\CommandRules\Mcp\Tools\CommandRequestShowTool;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the command request the journal holds for its line, with the steps it still waits on.
 */
#[TestsMcpTool(CommandRequestShowTool::class)]
final class CommandRequestShowToolTest extends McpToolEntryTestCase
{
    use HoldsCommandRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Runner');
        $request = $this->heldRequest($journal, $start);

        return ToolCall::by($start)->arguments(['request' => $request]);
    }
}
