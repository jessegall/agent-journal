<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use App\Support\ActorReference;
use Domain\Chat\ChatDomain;
use Domain\Chat\Mcp\Tools\DockListTool;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner lists what is docked beside it.
 */
#[TestsMcpTool(DockListTool::class)]
final class DockListToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');

        $journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($journal->ownerUser()),
            ActorReference::of($start->agent),
        );

        return ToolCall::by($start);
    }
}
