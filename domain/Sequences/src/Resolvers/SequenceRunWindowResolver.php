<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Exceptions\SequenceRunMissing;
use Domain\Sequences\Http\Pages\SequenceRuns\SequenceRunsShow;
use Domain\Sequences\Http\Requests\SequenceRunRequest;
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
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $run = $this->runs->get($this->request->runId());
        } catch (SequenceRunMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        return $this->page->of($run);
    }
}
