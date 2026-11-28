<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Actors\Contracts\ActorVisibility;
use App\Exceptions\InvalidActorText;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsIndex;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsShow;
use Domain\Sequences\Http\Requests\SequenceRunRequest;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * One sequence run for the one who may read it. A run the reader may not read is not found.
 */
final readonly class SequenceRunPageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SequenceRecords $runs,
        private SequenceRunsShow $page,
        private SequenceRunsIndex $index,
        private ActorVisibility $visibility,
    ) {}

    public function build(Request $visit): SequenceRunPageData
    {
        return SequenceRunPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->forVisit(SequenceRunRequest::class, $visit);

        try {
            $run = $this->runs->numbered($input->runNumber());
        } catch (SequenceRunMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        if (! $this->visibility->canReadAcrossOwners() || $run->actor_id === null) {
            return $this->page->of($run);
        }

        try {
            return $this->besideItsList($input, $run);
        } catch (InvalidActorText $invalid) {
            throw new NotFoundHttpException(previous: $invalid);
        }
    }

    /**
     * The run beside the runs list it was opened from, the actor and page kept, so Back returns there.
     */
    private function besideItsList(SequenceRunRequest $input, SequenceRun $run): DeclaredLayoutData
    {
        $follower = $input->hasFollower() ? $input->follower() : $run->owningActor();

        return $this->index->of(
            $this->runs->followers(),
            $follower,
            $this->runs->runsOf($follower, $input->pageNumber()),
            $run->id,
            [$this->page->part($run)],
        );
    }
}
