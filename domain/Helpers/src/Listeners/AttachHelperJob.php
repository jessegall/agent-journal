<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use App\Events\Sessions\StartSessionOpened;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\States\Support\HelperJobStateReference;

/**
 * A start Core opened for a live helper job attaches the job to the new session, which then runs it, and puts the
 * job's state on the helper's stack in the start's transaction.
 */
#[InCommandTransaction]
final readonly class AttachHelperJob implements Listener
{
    public function __construct(private AgentStack $stacks) {}

    public function handle(StartSessionOpened $event): void
    {
        if ($event->ownerWork === null || $event->ownerWork->type !== HelperJob::LINK_TYPE) {
            return;
        }

        $job = HelperJob::query()->acrossActors()->whereKey($event->ownerWork->id)->lockForUpdate()->firstOrFail();

        if (! $job->state->isLive()) {
            return;
        }

        $identity = HelperIdentity::query()->acrossActors()->whereKey($job->helper_identity_id)->firstOrFail();
        $purpose = HelperPurpose::query()->acrossActors()->whereKey($job->helper_purpose_id)->firstOrFail();
        $job->attachTo($event->sessionId);

        $this->stacks->pushFor(
            $identity->helperActor,
            HelperJobStateReference::forJob($job, $identity, $purpose->label),
        );
    }
}
