<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\Exceptions\NotificationUnavailable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\DeliversNotifications;
use Tests\TestCase;

/**
 * A user who opens what a notification points at marks that notification read; a target with no notification of
 * theirs is not there.
 */
final class MarkTargetNotificationReadTest extends TestCase
{
    use DeliversNotifications;
    use RefreshHookDatabase;

    public function test_the_notification_of_the_target_is_read_and_a_target_without_one_is_refused(): void
    {
        $this->journal->owner();
        [$first, $second] = $this->notify($this->journal->actorCalled('Owner'), 1, 2);

        $this->journal->run(new MarkTargetNotificationReadCommand('chat.question', '2'));

        $this->assertNull($first->refresh()->read_at);
        $this->assertNotNull($second->refresh()->read_at);
        $this->assertThrows(
            fn () => $this->journal->run(new MarkTargetNotificationReadCommand('chat.question', '9')),
            NotificationUnavailable::class,
        );
    }
}
