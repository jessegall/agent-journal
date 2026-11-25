<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkAllNotificationsRead\MarkAllNotificationsReadCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user marks every notification read up to the one they saw last, and says whether that finished it; later
 * notifications stay unread.
 */
final class MarkAllNotificationsReadTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_notifications_up_to_the_last_seen_are_read_and_later_ones_stay_unread(): void
    {
        $this->journal->owner()->notifyQuestions('Owner', 1, 3);

        $finished = $this->journal->run(
            new MarkAllNotificationsReadCommand($this->journal->notificationCalled('Question 2')->sequence),
        );

        $this->journal->assertResult(true, $finished)
            ->assertNotificationRead('Question 1')
            ->assertNotificationRead('Question 2')
            ->assertNotificationUnread('Question 3')
            ->assertUnreadNotifications('Owner', 1);
    }
}
