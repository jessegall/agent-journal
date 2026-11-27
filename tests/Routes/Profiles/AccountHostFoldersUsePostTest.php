<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Hosts\Commands\ReadFolderUse\ReadFolderUseCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's sign-in runner asks whether a container still binds an account folder.
 */
#[TestsRoute('POST', 'profiles.account-host.folders.use')]
final class AccountHostFoldersUsePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['folder' => 'a7', 'operation' => 'operation-1'])
            ->reply(ReadFolderUseCommand::class, 'instruction-1')
            ->answers(['instruction_id' => 'instruction-1'])
            ->expects(ReadFolderUseCommand::class, [
                'hostId' => $host->hostId,
                'folder' => 'a7',
                'operation' => 'operation-1',
            ]);
    }
}
