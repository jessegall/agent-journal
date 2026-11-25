<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers\Support;

use App\Exceptions\CrossOwnerReadRefused;
use App\Support\ActorIdentity;
use App\Support\NumberedPage;
use App\Values\StackTarget;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Values\SequenceRunPage;

/**
 * The named reads of sequence runs the Sequences domain answers for: the calling agent's own, and one the journal
 * started.
 */
final readonly class SequenceRecords
{
    public const int RUN_PAGE_SIZE = 25;

    public function get(string $runId): SequenceRun
    {
        return SequenceRun::query()->forActor()->findOr($runId, SequenceRunMissing::throwing()->forId($runId));
    }

    /**
     * The run of this number, when the caller may read it.
     *
     * @throws SequenceRunMissing
     */
    public function numbered(int $number): SequenceRun
    {
        return SequenceRun::query()->forActor()->numberedInJournal($number)->firstOr(
            SequenceRunMissing::throwing()->forNumber($number),
        );
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
     * The actors whose runs the caller may read: every follower, for a caller that may read across owners.
     *
     * @return list<ActorIdentity>
     *
     * @throws CrossOwnerReadRefused
     */
    public function followers(): array
    {
        return SequenceRun::followers();
    }

    /**
     * One numbered page of the runs this actor follows, newest first, for a caller that may read across owners.
     *
     * @throws CrossOwnerReadRefused
     */
    public function runsOf(ActorIdentity $follower, int $pageNumber): SequenceRunPage
    {
        $page = new NumberedPage($pageNumber, self::RUN_PAGE_SIZE);
        $runs = SequenceRun::query()->acrossOwners()->followedBy($follower);
        $total = $runs->clone()->count();
        $shown = $runs->orderByDesc('number')->forPage($page->number, $page->size)->get();

        return new SequenceRunPage(array_values($shown->all()), $page, $total);
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
            ->findOr($runId, SequenceRunMissing::throwing()->forId($runId));
    }
}
