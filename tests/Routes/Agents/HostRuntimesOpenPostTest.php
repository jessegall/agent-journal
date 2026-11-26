<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\OpenHostMainRuntime\OpenHostMainRuntimeCommand;
use App\Support\OpenedRuntime;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host opens the main runtime of an agent on a folder.
 */
#[TestsRoute('POST', 'agents.host.runtimes.open')]
final class HostRuntimesOpenPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $agentId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'agentId' => $agentId,
                'folder' => '/Users/owner/shop',
                'driver' => 'claude-code',
                'driverBuild' => '2.1.323',
                'profile' => 'main-agent',
            ])
            ->reply(OpenHostMainRuntimeCommand::class, new OpenedRuntime(
                strtolower((string) Str::ulid()),
                strtolower((string) Str::ulid()),
                null,
            ))
            ->expects(OpenHostMainRuntimeCommand::class, [
                'hostId' => $host->hostId,
                'agentId' => $agentId,
                'folder' => '/Users/owner/shop',
                'driver' => 'claude-code',
            ]);
    }
}
