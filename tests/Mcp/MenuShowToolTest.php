<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Agents\Drivers\Values\MenuStep;
use App\Mcp\Tools\MenuShowTool;
use App\Models\Drivers\MenuEntry;
use App\Navigation\Enums\NavigationCompletion;
use App\Support\ActorReference;
use Tests\Support\Agents\HoldsNavigationRequests;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The main agent reads one entry of the owner's menu library.
 */
#[TestsMcpTool(MenuShowTool::class)]
final class MenuShowToolTest extends McpToolEntryTestCase
{
    use HoldsNavigationRequests;

    protected function arrange(TestJournal $journal): ToolCall
    {
        [$start, $navigation] = $this->heldNavigation($journal);
        $navigation->cancel();
        $entry = MenuEntry::create(
            ActorReference::of($journal->ownerUser()),
            $navigation,
            [new MenuStep('fp1:first', 'GPT-6', null, null)],
            NavigationCompletion::Goal,
            'GPT-6',
        );

        return ToolCall::by($start)
            ->arguments(['entry' => $entry->id]);
    }
}
