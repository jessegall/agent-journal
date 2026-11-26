<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Hosts\Commands\MakeHostFolder\MakeHostFolderCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's sign-in runner asks for an account folder to be made.
 */
#[TestsRoute('POST', 'profiles.account-host.folders.make')]
final class AccountHostFoldersMakePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['folder' => 'a7', 'operation' => 'operation-1'])
            ->reply(MakeHostFolderCommand::class, 'order-1')
            ->expects(MakeHostFolderCommand::class, [
                'hostId' => $host->hostId,
                'folder' => 'a7',
                'operation' => 'operation-1',
            ]);
    }
}
