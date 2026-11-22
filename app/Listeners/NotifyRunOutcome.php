<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Contracts\Notifications;
use App\Data\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Events\RunOutcomeRecorded;
use App\Models\ProcessRun;
use App\Resolvers\RunNotificationTarget;

/**
 * Tells the actor responsible for a run of its attempt's logical result, in the transaction that recorded it: one
 * receipt per attempt. A correction meets the attempt's own occurrence key, so the same receipt shows the corrected
 * result with its read state kept; scheduled successes, unowned failures and stops stay in the run's history.
 */
#[InCommandTransaction]
final readonly class NotifyRunOutcome implements Listener
{
    public function __construct(private Notifications $notifications) {}

    public function handle(RunOutcomeRecorded $fact): void
    {
        $recipients = ProcessRun::ofAnyActor($fact->runId)->outcomeRecipients($fact->result);

        if ($recipients === []) {
            return;
        }

        $this->notifications->deliver(
            "run:{$fact->attemptId}",
            NotificationSourceType::RunOutcome,
            new NotificationTarget(RunNotificationTarget::KEY, $fact->runId),
            $recipients,
        );
    }
}
