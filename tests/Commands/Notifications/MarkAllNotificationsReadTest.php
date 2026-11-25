<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use App\Models\Notifications\NotificationReceipt;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\DeliversNotifications;
use Tests\TestCase;

/**
 * A user marks every notification read up to the one they saw last, and says whether that finished it; later
 * notifications stay unread.
 */
final class MarkAllNotificationsReadTest extends TestCase
{
    use DeliversNotifications;
    use RefreshHookDatabase;

    public function test_notifications_up_to_the_last_seen_are_read_and_later_ones_stay_unread(): void
    {
        $this->journal->owner();
        $receipts = $this->notify($this->journal->actorCalled('Owner'), 1, 3);

        $finished = $this->journal->run(new MarkAllNotificationsReadCommand($receipts[1]->sequence));

        $this->assertTrue($finished);
        $this->assertSame(
            [$receipts[2]->id],
            NotificationReceipt::query()->whereNull('read_at')->pluck('id')->all(),
        );
    }
}
