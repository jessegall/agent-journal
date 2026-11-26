<?php

declare(strict_types=1);

namespace Tests\Routes\Asks;

use App\Profiles\ProfileProposal;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent lists the asks in its inbox: nothing is sent on.
 */
#[TestsRoute('POST', 'asks.agent.list')]
final class AgentListPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->activatedProfile(ProfileProposal::fromConfiguration((array) config('profiles')));

        return RouteCall::as(Caller::Agent, $journal->signedStart('Requester', 'journal-worker'));
    }
}
