<?php

declare(strict_types=1);

namespace Tests\Support\Agents;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent's signed start holding the journal's main inbox, and a navigation request raised for a stalled key
 * script, which the main agent is asked to pass.
 */
trait HoldsNavigationRequests
{
    use RaisesNavigationRequests;

    /**
     * @return array{TestStart, NavigationRequest, DriverRequest}
     */
    private function heldNavigation(TestJournal $journal): array
    {
        $start = $journal->installInboxes()->signedStart('Main');
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->journal->seatMainAgent($start->agent),
        );
        $stalled = $this->stalledScript();

        return [$start, $this->raise($stalled, 'raise-1'), $stalled];
    }
}
