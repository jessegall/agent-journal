<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\Navigation\AbandonNavigation\AbandonNavigationCommand;
use App\Mcp\Tools\NavigationGiveUpTool;
use Tests\Support\Agents\HoldsNavigationRequests;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The main agent gives up on a stalled screen: the tool sends the one abandon command with its reason.
 */
#[TestsMcpTool(NavigationGiveUpTool::class)]
final class NavigationGiveUpToolTest extends McpToolEntryTestCase
{
    use HoldsNavigationRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        [$start, $navigation, $stalled] = $this->heldNavigation($journal);

        return ToolCall::by($start)
            ->arguments([
                'request' => $navigation->id,
                'version' => $navigation->row_version,
                'reason' => 'The picker shows no such model.',
                'request_key' => 'give-up-1',
            ])
            ->reply(AbandonNavigationCommand::class, $navigation->id)
            ->expects(ExpectedCommand::of(AbandonNavigationCommand::class, [
                'navigationId' => $navigation->id,
                'reason' => 'The picker shows no such model.',
            ]));
    }
}
