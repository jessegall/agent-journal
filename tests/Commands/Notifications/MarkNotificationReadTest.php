<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Models\Notifications\NotificationReceipt;
use App\Notifications\Commands\MarkNotificationRead\MarkNotificationReadCommand;
use App\Notifications\Exceptions\NotificationUnavailable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user marks one of their notifications read and the others stay unread; a notification of someone else is not
 * there for them.
 */
#[TestsCommand(MarkNotificationReadCommand::class)]
final class MarkNotificationReadTest extends TestCase
{
    use RefreshHookDatabase;

    private const array TABLES = [
        'notification_changes',
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    public function test_one_notification_is_read_and_the_others_stay_unread(): void
    {
        $this->journal->owner()->notifyRunOutcomes('Owner', 1, 2);

        $this->journal->run(new MarkNotificationReadCommand($this->journal->notificationCalled('Run 1')->id));

        $this->journal->assertNotificationRead('Run 1')->assertNotificationUnread('Run 2');
    }

    public function test_a_notification_of_someone_else_is_not_there(): void
    {
        $this->journal->owner()->user('Guest')->notifyRunOutcomes('Guest', 1, 1);
        $guestReceipt = $this->journal->notificationCalled('Run 1')->id;

        $this->journal->assertRefused(
            NotificationUnavailable::class,
            fn () => $this->journal->run(new MarkNotificationReadCommand($guestReceipt)),
        )->assertNotificationUnread('Run 1');
    }

    public function test_marking_a_receipt_read_twice_lowers_the_count_once(): void
    {
        $this->journal->owner()->notifyRunOutcomes('Owner', 1, 2);
        $command = new MarkNotificationReadCommand($this->journal->notificationCalled('Run 2')->id);

        $this->journal->run($command);
        $this->journal->run($command);

        $this->journal->assertNotificationRead('Run 2')->assertNotificationUnread('Run 1');
        $this->assertSame(1, NotificationReceipt::query()->withoutGlobalScopes()->whereNull('read_at')->count());
    }
}
