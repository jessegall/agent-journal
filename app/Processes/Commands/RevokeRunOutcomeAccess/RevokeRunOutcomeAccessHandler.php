<?php

declare(strict_types=1);

namespace App\Processes\Commands\RevokeRunOutcomeAccess;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\Notifications;
use App\Communication\Data\NotificationTarget;
use App\Contracts\CommandHandler;
use App\Processes\Exceptions\RunOutcomeAccessRefused;
use App\Processes\Models\ProcessRun;
use App\Processes\Resolvers\RunNotificationTarget;

final readonly class RevokeRunOutcomeAccessHandler implements CommandHandler
{
    public function __construct(private Notifications $notifications) {}

    /**
     * @throws RunOutcomeAccessRefused
     */
    public function handle(RevokeRunOutcomeAccessCommand $command): void
    {
        $run = ProcessRun::lockedForOutcome($command->runId);

        if (! $run->isByActor(ActorIdentity::of($command->dispatchedBy()))) {
            throw RunOutcomeAccessRefused::notYours($run->id);
        }

        if ($run->outcome_user_id === null) {
            return;
        }

        $user = new ActorIdentity(ActorType::User, $run->outcome_user_id);
        $run->revokeOutcomeUser();
        $this->notifications->withdraw(new NotificationTarget(RunNotificationTarget::KEY, $run->id), $user);
    }
}
