<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\Navigation\AnswerNavigation\AnswerNavigationCommand;
use App\Mcp\Tools\NavigationAnswerTool;
use Tests\Support\Agents\HoldsNavigationRequests;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The main agent sends one round to a stalled screen: the tool sends the one answer command at the version and generation it read.
 */
#[TestsMcpTool(NavigationAnswerTool::class)]
final class NavigationAnswerToolTest extends McpToolEntryTestCase
{
    use HoldsNavigationRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        [$start, $navigation, $stalled] = $this->heldNavigation($journal);

        return ToolCall::by($start)
            ->arguments([
                'request' => $navigation->id,
                'version' => $navigation->row_version,
                'generation' => $navigation->screen->generation,
                'keys' => ['down'],
                'request_key' => 'answer-1',
            ])
            ->reply(AnswerNavigationCommand::class, $stalled->receipt)
            ->expects(AnswerNavigationCommand::class, [
                'navigationId' => $navigation->id,
                'expectedRowVersion' => $navigation->row_version,
                'generation' => $navigation->screen->generation,
            ]);
    }
}
