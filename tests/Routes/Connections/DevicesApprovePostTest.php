<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner approves the terminal that shows this code.
 */
#[TestsRoute('POST', 'connections.devices.approve')]
final class DevicesApprovePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)
            ->parameters([
                'code' => 'ABCD-EFGH',
            ])
            ->expects(ApproveDeviceGrantCommand::class, [
                'userCode' => 'ABCD-EFGH',
            ]);
    }
}
