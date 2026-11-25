<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\NavigationShowTool;
use Tests\Support\Agents\HoldsNavigationRequests;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The main agent reads a stalled screen it is asked to pass.
 */
#[TestsMcpTool(NavigationShowTool::class)]
final class NavigationShowToolTest extends McpToolEntryTestCase
{
    use HoldsNavigationRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        [$start, $navigation, $stalled] = $this->heldNavigation($journal);

        return ToolCall::by($start)
            ->arguments(['request' => $navigation->id]);
    }
}
