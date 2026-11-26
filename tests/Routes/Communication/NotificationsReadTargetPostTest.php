<?php

declare(strict_types=1);

namespace Tests\Routes\Communication;

use App\Commands\Notifications\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user marks the notifications about one record as read.
 */
#[TestsRoute('POST', 'communication.notifications.read-target')]
final class NotificationsReadTargetPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $targetId = (string) Str::ulid();

        return RouteCall::as(Caller::User)
            ->payload([
                'targetKey' => 'task',
                'targetId' => $targetId,
            ])
            ->expects(MarkTargetNotificationReadCommand::class, [
                'targetKey' => 'task',
                'targetId' => $targetId,
            ]);
    }
}
