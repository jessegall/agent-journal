<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Enums\Sessions\OfflineReplyMode;
use App\Support\RuntimeStart;
use App\Support\StartGrant;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;

/**
 * The host claims the start grant of a runtime it is to start.
 */
#[TestsRoute('POST', 'agents.host.start')]
final class HostStartPostTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $runtime = $this->runtimeOn($host->hostId);

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'runtime' => $runtime->id,
            ])
            ->reply(ClaimStartGrantCommand::class, new StartGrant(
                'token-1',
                [],
                null,
                null,
                OfflineReplyMode::Neutral,
                'seal-1',
                RuntimeStart::of($runtime),
            ))
            ->expects(ClaimStartGrantCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => $runtime->id,
            ]);
    }
}
