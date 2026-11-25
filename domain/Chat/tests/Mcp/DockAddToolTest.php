<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Mcp;

use App\Support\ActorIdentity;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Mcp\Tools\DockAddTool;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner docks a task above their conversation.
 */
#[TestsMcpTool(DockAddTool::class)]
final class DockAddToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $journal->fixtures(ChatFixtures::class)->pairChat(
            ActorIdentity::of($journal->ownerUser()),
            ActorIdentity::of($start->agent),
        );
        $task = Task::factory()->create(['title' => 'Ship the dock']);

        return ToolCall::by($start)
            ->arguments([
                'type' => 'tasks.task',
                'id' => $task->id,
                'request_key' => 'dock-add-1',
            ])
            ->reply(DockSourceCommand::class, DockResult::of(DockOutcome::Added, 'placement-1'))
            ->expects(ExpectedCommand::of(DockSourceCommand::class, [
                'type' => 'tasks.task',
                'id' => $task->id,
            ]));
    }
}
