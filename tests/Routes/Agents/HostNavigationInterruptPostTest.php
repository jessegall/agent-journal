<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Navigation\InterruptNavigation\InterruptNavigationCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host interrupts a navigation it can no longer finish.
 */
#[TestsRoute('POST', 'agents.host.navigation.interrupt')]
final class HostNavigationInterruptPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'navigation' => $id,
            ])
            ->expects(InterruptNavigationCommand::class, [
                'hostId' => $host->hostId,
                'navigationId' => $id,
            ]);
    }
}
