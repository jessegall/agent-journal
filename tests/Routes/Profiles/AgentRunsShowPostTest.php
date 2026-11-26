<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Models\Profiles\ProfileRun;
use App\Support\ActorReference;
use App\Values\WorkReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one of its own profile runs with its step results: nothing is sent on.
 */
#[TestsRoute('POST', 'profiles.agent.runs.show')]
final class AgentRunsShowPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');
        $run = ProfileRun::create(
            ActorReference::of($start->agent),
            WorkReference::free('ask'),
            'main-agent',
            1,
            str_repeat('a', 64),
            'trigger-1',
        );

        return RouteCall::as(Caller::Agent, $start)->payload([
            'id' => $run->id,
        ]);
    }
}
