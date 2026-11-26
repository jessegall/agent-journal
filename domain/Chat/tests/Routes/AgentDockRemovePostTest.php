<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner takes a task off the dock above their conversation.
 */
#[TestsRoute('POST', 'chat.agent.dock.remove')]
final class AgentDockRemovePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Builder');
        $task = Task::factory()->create(['title' => 'Ship the dock']);
        $journal->actAsAgentIds($start->agent->id, $start->session->id)->run(new DockSourceCommand(null, 'tasks.task', $task->id));
        $placement = DockPlacement::query()->sole();

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'placement' => $placement->id,
                'chat' => null,
                'request_key' => 'dock-remove-1',
            ])
            ->reply(UndockSourceCommand::class, DockResult::of(DockOutcome::Removed, $placement->id))
            ->expects(UndockSourceCommand::class, [
                'chat' => null,
                'placementId' => $placement->id,
                'type' => 'tasks.task',
                'id' => $task->id,
            ]);
    }
}
