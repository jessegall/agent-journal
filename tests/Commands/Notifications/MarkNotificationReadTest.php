<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkNotificationRead\MarkNotificationReadCommand;
use App\Exceptions\NotificationUnavailable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\DeliversNotifications;
use Tests\TestCase;

/**
 * A user marks one of their notifications read and the others stay unread; a notification of someone else is not
 * there for them.
 */
final class MarkNotificationReadTest extends TestCase
{
    use DeliversNotifications;
    use RefreshHookDatabase;

    public function test_one_notification_is_read_and_the_others_stay_unread(): void
    {
        $this->journal->owner();
        [$first, $second] = $this->notify($this->journal->actorCalled('Owner'), 1, 2);

        $this->journal->run(new MarkNotificationReadCommand($first->id));

        $this->assertNotNull($first->refresh()->read_at);
        $this->assertNull($second->refresh()->read_at);
    }

    public function test_a_notification_of_someone_else_is_not_there(): void
    {
        $this->journal->owner()->user('Guest');
        [$guestReceipt] = $this->notify($this->journal->actorCalled('Guest'), 1, 1);

        $this->assertThrows(
            fn () => $this->journal->run(new MarkNotificationReadCommand($guestReceipt->id)),
            NotificationUnavailable::class,
        );
        $this->assertNull($guestReceipt->refresh()->read_at);
    }
}
