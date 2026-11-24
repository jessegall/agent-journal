<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Support\ActorIdentity;
use App\Values\AgentText;
use Domain\Helpers\Exceptions\ContextUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;

/**
 * Builds, read-only, what a helper with a live job must be told whenever its context starts: who it is, its profile
 * and revision, the purpose, the whole brief, the steering so far and the records it was given. A helper with no live
 * job is told nothing.
 */
final readonly class JobContext
{
    /**
     * @return list<AgentText>
     *
     * @throws ContextUnavailable
     */
    public function remindersFor(ActorIdentity $helper): array
    {
        $identity = HelperIdentity::query()
            ->acrossActors()
            ->where('helper_actor_type', $helper->type->value)
            ->where('helper_actor_id', $helper->id)
            ->first();

        $job = $identity === null ? null : HelperJob::query()
            ->acrossActors()
            ->ofIdentities([$identity->id])
            ->open()
            ->latest('id')
            ->first();

        if ($identity === null || $job === null || ! $job->state->isLive()) {
            return [];
        }

        $purpose = HelperPurpose::query()->acrossActors()->whereKey($job->helper_purpose_id)->firstOr(
            fn () => throw ContextUnavailable::forJob($job->id),
        );

        return $job->contextFor($identity, $purpose->label);
    }
}
