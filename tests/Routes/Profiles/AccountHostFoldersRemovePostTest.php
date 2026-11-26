<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Hosts\RemoveHostFolder\RemoveHostFolderCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's sign-in runner asks for an account folder to be removed.
 */
#[TestsRoute('POST', 'profiles.account-host.folders.remove')]
final class AccountHostFoldersRemovePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['folder' => 'a7', 'operation' => 'operation-1'])
            ->reply(RemoveHostFolderCommand::class, 'order-1')
            ->expects(RemoveHostFolderCommand::class, [
                'hostId' => $host->hostId,
                'folder' => 'a7',
                'operation' => 'operation-1',
            ]);
    }
}
