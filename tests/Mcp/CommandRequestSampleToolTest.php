<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Mcp\Tools\CommandRequestSampleTool;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Processes\HoldsCommandRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent starts the sample run a permit allows: the tool sends the one start command and names the run.
 */
#[TestsMcpTool(CommandRequestSampleTool::class)]
final class CommandRequestSampleToolTest extends McpToolEntryTestCase
{
    use HoldsCommandRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Runner');
        $request = $this->heldRequest($journal, $start);

        return ToolCall::by($start)
            ->arguments(['request' => $request, 'permit' => 'permit-1', 'request_key' => 'sample-1'])
            ->reply(StartSampleCommand::class, '01jd8x0g9m3qz6v4k2t7r5w1cf')
            ->expects(ExpectedCommand::of(StartSampleCommand::class, [
                'commandRequestId' => $request,
                'permitId' => 'permit-1',
            ]));
    }
}
