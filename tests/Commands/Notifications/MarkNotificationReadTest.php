<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkNotificationRead\MarkNotificationReadCommand;
use App\Exceptions\NotificationUnavailable;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user marks one of their notifications read and the others stay unread; a notification of someone else is not
 * there for them.
 */
final class MarkNotificationReadTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_one_notification_is_read_and_the_others_stay_unread(): void
    {
        $this->journal->owner()->notifyQuestions('Owner', 1, 2);

        $this->journal->run(new MarkNotificationReadCommand($this->journal->notificationCalled('Question 1')->id));

        $this->journal->assertNotificationRead('Question 1')->assertNotificationUnread('Question 2');
    }

    public function test_a_notification_of_someone_else_is_not_there(): void
    {
        $this->journal->owner()->user('Guest')->notifyQuestions('Guest', 1, 1);
        $guestReceipt = $this->journal->notificationCalled('Question 1')->id;

        $this->journal->assertRefused(
            NotificationUnavailable::class,
            fn () => $this->journal->run(new MarkNotificationReadCommand($guestReceipt)),
        )->assertNotificationUnread('Question 1');
    }
}
