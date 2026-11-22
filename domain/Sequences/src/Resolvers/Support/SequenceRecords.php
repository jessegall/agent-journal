<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers\Support;

use App\Support\ActorIdentity;
use App\Values\StackTarget;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Models\SequenceRun;

/**
 * The named reads of sequence runs the Sequences domain answers for: the calling agent's own, and one the journal
 * started.
 */
final readonly class SequenceRecords
{
    public function get(string $runId): SequenceRun
    {
        return SequenceRun::query()->forActor()->findOr($runId, fn () => throw SequenceRunMissing::forId($runId));
    }

    /**
     * The runs of these ids the actor may read, by id, in one read.
     *
     * @param  list<string>  $runIds
     * @return array<string, SequenceRun>
     */
    public function many(array $runIds): array
    {
        return SequenceRun::query()->forActor()->whereKey($runIds)->readExactly(
            count($runIds),
        )->get()->keyBy('id')->all();
    }

    /**
     * The journal's own read of a run it started for an agent, outside that agent's requests.
     */
    public function followedBy(StackTarget $target, string $runId): SequenceRun
    {
        return $this->heldBy($target->actorIdentity(), $runId);
    }

    /**
     * The journal's own read of a run the agent follows, by the agent alone.
     */
    public function heldBy(ActorIdentity $follower, string $runId): SequenceRun
    {
        return SequenceRun::query()
            ->ownedBy($follower)
            ->findOr($runId, fn () => throw SequenceRunMissing::forId($runId));
    }
}
