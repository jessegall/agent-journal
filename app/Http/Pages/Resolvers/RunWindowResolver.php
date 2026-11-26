<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Pages\ProcessRuns\ProcessRunsShow;
use App\Http\Requests\Processes\RunPageRequest;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Navigation\Contracts\PageResolver;
use App\Processes\Data\PartOutputData;
use App\Processes\Data\ProblemData;
use App\Processes\Data\RunWindowData;
use App\Processes\Resolvers\Support\RunSnapshotResolver;
use App\Processes\StoredOutput;
use App\Support\Layout\DeclaredLayoutData;

/**
 * One run of the current project for its page: the live snapshot, the escaped tail of every stream of every part and
 * the problems of each part's latest assessment, or the removed page when the viewer cannot see the run.
 */
final readonly class RunWindowResolver implements PageResolver
{
    private const int TAIL_LINES = 200;

    public function __construct(
        private RunPageRequest $page,
        private RunSnapshotResolver $snapshots,
        private StoredOutput $output,
        private ProcessRunsShow $layout,
    ) {}

    public function read(): DeclaredLayoutData
    {
        if (! $this->snapshots->canSee($this->page->runId())) {
            return $this->layout->removed();
        }

        $snapshot = $this->snapshots->snapshot($this->page->runId());
        $run = ProcessRun::query()->forActor()->whereKey($snapshot->runId)->firstOrFail();
        $parts = $run->parts()->readLimit(500)->get();

        $detail = new RunWindowData(
            $snapshot,
            $parts->mapWithKeys(fn (PartRun $part) => [$part->id => $this->outputsOf($part)])->all(),
            $parts->mapWithKeys(fn (PartRun $part) => [$part->id => $this->problemsOf($part)])->all(),
            $run->stop_reason,
        );

        return $this->layout->of($detail);
    }

    /**
     * @return list<PartOutputData>
     */
    private function outputsOf(PartRun $part): array
    {
        $outputs = [];

        foreach ($part->recordedStreams() as $stream) {
            $tail = $this->output->tail($part, $stream, self::TAIL_LINES);
            $outputs[] = new PartOutputData($stream->value, $tail['before'], $tail['end'], $tail['text']);
        }

        return $outputs;
    }

    /**
     * @return list<ProblemData>
     */
    private function problemsOf(PartRun $part): array
    {
        $assessment = OutputAssessment::findLatestOf($part);

        if ($assessment === null) {
            return [];
        }

        return array_map(ProblemData::fromProblem(...), $assessment->problems->items());
    }
}
