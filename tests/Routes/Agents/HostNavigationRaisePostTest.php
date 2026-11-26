<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Navigation\RaiseNavigation\RaiseNavigationCommand;
use App\Support\NavigationRaiseAnswer;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host raises a navigation of a runtime's menu it could not finish alone.
 */
#[TestsRoute('POST', 'agents.host.navigation.raise')]
final class HostNavigationRaisePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'runtime' => $id,
            ])
            ->payload([
                'operationKey' => 'operation-1',
                'requestId' => 'request-1',
                'attempt' => 1,
                'step' => 1,
                'reason' => 'no-entry',
                'fingerprint' => str_repeat('a', 64),
                'rows' => [],
                'highlight' => 0,
                'generation' => 1,
            ])
            ->reply(RaiseNavigationCommand::class, NavigationRaiseAnswer::held())
            ->expects(RaiseNavigationCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => $id,
                'operationKey' => 'operation-1',
                'requestId' => 'request-1',
                'attempt' => 1,
            ]);
    }
}
