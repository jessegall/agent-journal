<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Resolvers;

use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Navigation\PageResolver;
use App\Exceptions\InvalidActorText;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsIndex;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsShow;
use Domain\Sequences\Http\Requests\SequenceRunRequest;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One sequence run for the one who may read it. A run the reader may not read is not found.
 */
final readonly class SequenceRunWindowResolver implements PageResolver
{
    public function __construct(
        private SequenceRunRequest $request,
        private SequenceRecords $runs,
        private SequenceRunsShow $page,
        private SequenceRunsIndex $index,
        private ActorVisibility $visibility,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $run = $this->runs->numbered($this->request->runNumber());
        } catch (SequenceRunMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        if (! $this->visibility->canReadAcrossOwners() || $run->actor_id === null) {
            return $this->page->of($run);
        }

        try {
            return $this->besideItsList($run);
        } catch (InvalidActorText $invalid) {
            throw new NotFoundHttpException(previous: $invalid);
        }
    }

    /**
     * The run beside the runs list it was opened from, the actor and page kept, so Back returns there.
     */
    private function besideItsList(SequenceRun $run): DeclaredLayoutData
    {
        $follower = $this->request->hasFollower() ? $this->request->follower() : $run->owningActor();

        return $this->index->of(
            $this->runs->followers(),
            $follower,
            $this->runs->runsOf($follower, $this->request->pageNumber()),
            $run->id,
            [$this->page->part($run)],
        );
    }
}
