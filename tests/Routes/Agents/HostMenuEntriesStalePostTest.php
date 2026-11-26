<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Navigation\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Enums\Navigation\NavigationReason;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a menu entry no longer matches the screen.
 */
#[TestsRoute('POST', 'agents.host.menu-entries.stale')]
final class HostMenuEntriesStalePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'entry' => $id,
            ])
            ->payload([
                'runtimeId' => 'runtime-1',
                'operationKey' => 'operation-1',
                'reason' => 'no-entry',
                'step' => 1,
                'build' => '2.1.323',
            ])
            ->expects(MarkMenuEntryStaleCommand::class, [
                'hostId' => $host->hostId,
                'entryId' => $id,
                'runtimeId' => 'runtime-1',
                'reason' => NavigationReason::NoEntry,
                'step' => 1,
                'build' => '2.1.323',
                'rows' => [],
            ]);
    }
}
