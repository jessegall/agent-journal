<?php

declare(strict_types=1);

namespace Tests\Routes\Connections;

use App\Commands\Projects\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner revokes one terminal's sign-in.
 */
#[TestsRoute('DELETE', 'connections.devices.revoke')]
final class DevicesRevokeDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $grantId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'grant' => $grantId,
            ])
            ->expects(RevokeDeviceGrantCommand::class, [
                'id' => $grantId,
            ]);
    }
}
