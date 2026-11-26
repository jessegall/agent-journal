<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Values\DockResult;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner docks a task above their conversation.
 */
#[TestsRoute('POST', 'chat.agent.dock.add')]
final class AgentDockAddPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Builder');
        $taskId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'type' => 'tasks.task',
                'id' => $taskId,
                'chat' => null,
                'request_key' => 'dock-add-1',
            ])
            ->reply(DockSourceCommand::class, DockResult::of(DockOutcome::Added, strtolower((string) Str::ulid())))
            ->expects(DockSourceCommand::class, [
                'chat' => null,
                'type' => 'tasks.task',
                'id' => $taskId,
            ]);
    }
}
