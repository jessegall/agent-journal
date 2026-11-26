<?php

declare(strict_types=1);

namespace Tests\Routes\Actors;

use App\Sessions\Commands\RecordUserHeartbeat\RecordUserHeartbeatCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user's open page says they are still there.
 */
#[TestsRoute('POST', 'actors.presence.heartbeat')]
final class PresenceHeartbeatPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)->expects(RecordUserHeartbeatCommand::class);
    }
}
