<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Mcp\Tools\DockRemoveTool;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Values\DockResult;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner takes a docked source off the dock.
 */
#[TestsMcpTool(DockRemoveTool::class)]
final class DockRemoveToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $chats = $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Builder');
        $placement = strtolower((string) Str::ulid());

        return ToolCall::by($start)
            ->arguments([
                'placement_id' => $placement,
                'type' => 'tasks.task',
                'source_id' => strtolower((string) Str::ulid()),
                'request_key' => 'dock-remove-1',
            ])
            ->reply(UndockSourceCommand::class, DockResult::of(DockOutcome::Removed, $placement))
            ->expects(ExpectedCommand::of(UndockSourceCommand::class, [
                'placementId' => $placement,
                'type' => 'tasks.task',
            ]));
    }
}
