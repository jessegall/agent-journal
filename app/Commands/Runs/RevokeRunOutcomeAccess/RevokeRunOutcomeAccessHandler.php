<?php

declare(strict_types=1);

namespace App\Commands\Runs\RevokeRunOutcomeAccess;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Notifications\Notifications;
use App\Data\Notifications\NotificationTarget;
use App\Exceptions\RunOutcomeAccessRefused;
use App\Models\Access\User;
use App\Models\Runs\ProcessRun;
use App\Resolvers\RunNotificationTarget;
use App\Support\ActorIdentity;

final readonly class RevokeRunOutcomeAccessHandler implements CommandHandler
{
    public function __construct(private Notifications $notifications) {}

    /**
     * @throws RunOutcomeAccessRefused
     */
    public function handle(RevokeRunOutcomeAccessCommand $command): void
    {
        $run = ProcessRun::findLockedForOutcome($command->runId);

        if (! $run->isByActor(ActorIdentity::of($command->dispatchedBy()))) {
            throw RunOutcomeAccessRefused::ofAnotherActor($run->id);
        }

        if ($run->outcome_user_id === null) {
            return;
        }

        $user = ActorIdentity::ofClass(User::class, $run->outcome_user_id);
        $run->revokeOutcomeUser();
        $this->notifications->withdraw(new NotificationTarget(RunNotificationTarget::KEY, $run->id), $user);
    }
}
