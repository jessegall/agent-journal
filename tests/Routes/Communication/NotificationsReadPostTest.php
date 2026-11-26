<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Commands\Notifications\MarkNotificationRead\MarkNotificationReadCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user marks one notification as read.
 */
#[TestsRoute('POST', 'communication.notifications.read')]
final class NotificationsReadPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $receiptId = (string) Str::ulid();

        return RouteCall::as(Caller::User)
            ->payload([
                'receiptId' => $receiptId,
            ])
            ->expects(MarkNotificationReadCommand::class, [
                'receiptId' => $receiptId,
            ]);
    }
}
