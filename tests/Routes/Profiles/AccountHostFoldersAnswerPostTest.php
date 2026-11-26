<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Hosts\ReadHostFolderAnswer\ReadHostFolderAnswerCommand;
use App\Enums\Hosts\HostOrderStatus;
use App\Values\HostFolderAnswer;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's sign-in runner reads where its folder order stands.
 */
#[TestsRoute('POST', 'profiles.account-host.folders.answer')]
final class AccountHostFoldersAnswerPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['order' => 'order-1'])
            ->reply(ReadHostFolderAnswerCommand::class, new HostFolderAnswer(HostOrderStatus::Done, '', false))
            ->expects(ReadHostFolderAnswerCommand::class, ['hostId' => $host->hostId, 'orderId' => 'order-1']);
    }
}
