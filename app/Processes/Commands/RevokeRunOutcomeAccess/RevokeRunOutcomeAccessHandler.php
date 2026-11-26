<?php

declare(strict_types=1);

namespace App\Processes\Commands\RevokeRunOutcomeAccess;

use App\Bus\Contracts\CommandHandler;
use App\Models\Access\User;
use App\Models\Runs\ProcessRun;
use App\Notifications\Contracts\Notifications;
use App\Notifications\Data\NotificationTarget;
use App\Processes\Exceptions\RunOutcomeAccessRefused;
use App\Processes\Resolvers\RunNotificationTarget;
use App\Support\ActorReference;

final readonly class RevokeRunOutcomeAccessHandler implements CommandHandler
{
    public function __construct(private Notifications $notifications) {}

    /**
     * @throws RunOutcomeAccessRefused
     */
    public function handle(RevokeRunOutcomeAccessCommand $command): void
    {
        $run = ProcessRun::findLockedForOutcome($command->runId);

        if (! $run->isByActor($command->dispatchedBy())) {
            throw RunOutcomeAccessRefused::ofAnotherActor($run->id);
        }

        if ($run->outcome_user_id === null) {
            return;
        }

        $user = ActorReference::ofClass(User::class, $run->outcome_user_id);
        $run->revokeOutcomeUser();
        $this->notifications->withdraw(new NotificationTarget(RunNotificationTarget::KEY, $run->id), $user);
    }
}
