<?php

declare(strict_types=1);

namespace Tests\Commands\Notifications;

use App\Commands\Notifications\MarkTargetNotificationRead\MarkTargetNotificationReadCommand;
use App\Exceptions\NotificationUnavailable;
use App\Resolvers\RunNotificationTarget;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A user who opens what a notification points at marks that notification read; a target with no notification of
 * theirs is not there.
 */
final class MarkTargetNotificationReadTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_notification_of_the_target_is_read_and_a_target_without_one_is_refused(): void
    {
        $this->journal->owner()->notifyRunOutcomes('Owner', 1, 2);

        $this->journal->run(new MarkTargetNotificationReadCommand(RunNotificationTarget::KEY, '2'));

        $this->journal->assertNotificationUnread('Run 1')->assertNotificationRead('Run 2')->assertRefused(
            NotificationUnavailable::class,
            fn () => $this->journal->run(new MarkTargetNotificationReadCommand(RunNotificationTarget::KEY, '9')),
        );
    }
}
