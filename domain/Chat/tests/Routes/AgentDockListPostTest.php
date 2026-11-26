<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent in a chat with the owner reads the dock above their conversation.
 */
#[TestsRoute('POST', 'chat.agent.dock.list')]
final class AgentDockListPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Builder');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'limit' => 5,
            ]);
    }
}
