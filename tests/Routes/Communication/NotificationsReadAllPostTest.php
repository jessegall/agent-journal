<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Notifications\Commands\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user marks every notification up to the newest they saw as read.
 */
#[TestsRoute('POST', 'communication.notifications.read-all')]
final class NotificationsReadAllPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)
            ->payload([
                'through' => 3,
            ])
            ->reply(MarkAllNotificationsReadCommand::class, true)
            ->expects(MarkAllNotificationsReadCommand::class, [
                'through' => 3,
            ]);
    }
}
