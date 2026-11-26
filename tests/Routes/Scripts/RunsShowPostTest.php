<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use App\Models\Profiles\ProfileRun;
use App\Support\ActorReference;
use App\Values\WorkReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user reads one of their own profile runs with its step results: nothing is sent on.
 */
#[TestsRoute('POST', 'scripts.runs.show')]
final class RunsShowPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $run = ProfileRun::create(
            ActorReference::of($journal->owner()->ownerUser()),
            WorkReference::free('ask'),
            'journal-worker',
            1,
            str_repeat('a', 64),
            'trigger-1',
        );

        return RouteCall::as(Caller::User)->payload([
            'id' => $run->id,
        ]);
    }
}
