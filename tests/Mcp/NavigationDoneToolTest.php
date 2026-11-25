<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\Navigation\ProveNavigation\ProveNavigationCommand;
use App\Enums\Navigation\NavigationCompletion;
use App\Mcp\Tools\NavigationDoneTool;
use Tests\Support\Agents\HoldsNavigationRequests;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The main agent says a stalled screen is passed: the tool sends the one prove command with what it completes and its proof.
 */
#[TestsMcpTool(NavigationDoneTool::class)]
final class NavigationDoneToolTest extends McpToolEntryTestCase
{
    use HoldsNavigationRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        [$start, $navigation, $stalled] = $this->heldNavigation($journal);

        return ToolCall::by($start)
            ->arguments([
                'request' => $navigation->id,
                'version' => $navigation->row_version,
                'completes' => 'goal',
                'proof' => 'Model: GPT-6',
                'request_key' => 'done-1',
            ])
            ->reply(ProveNavigationCommand::class, $stalled->receipt)
            ->expects(ExpectedCommand::of(ProveNavigationCommand::class, [
                'navigationId' => $navigation->id,
                'completes' => NavigationCompletion::Goal,
                'proof' => 'Model: GPT-6',
            ]))
            ->hiddenFromProfile('read-only-helper');
    }
}
