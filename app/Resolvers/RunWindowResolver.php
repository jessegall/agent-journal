<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\PageResolver;
use App\Data\PartOutputData;
use App\Data\ProblemData;
use App\Data\RunWindowData;
use App\Http\Requests\Processes\RunPageRequest;
use App\Models\OutputAssessment;
use App\Models\PartRun;
use App\Models\ProcessRun;
use App\Resolvers\Support\RunSnapshotResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use App\Support\StoredOutput;

/**
 * One run of the current project for its page, on the shared reader recipe: the live snapshot, the escaped tail of every stream of every part and
 * the problems of each part's latest assessment; a run that is not there is the removed notice with Back to the runs.
 */
final readonly class RunWindowResolver implements PageResolver
{
    private const int TAIL_LINES = 200;

    public function __construct(
        private RunPageRequest $page,
        private RunSnapshotResolver $snapshots,
        private StoredOutput $output,
    ) {}

    public function read(): DeclaredLayoutData
    {
        if (! $this->snapshots->canSee($this->page->runId())) {
            return DetailPage::removed('run', new LayoutBackData('/processes/runs', 'Runs'));
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

        return DetailPage::make("Run {$snapshot->runId}")
            ->withStanding(LayoutPartData::native('detail', LayoutNativeData::of('processes/RunView', $detail)))
            ->layout();
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
        $assessment = OutputAssessment::latestOf($part);

        return $assessment === null ? [] : array_map(ProblemData::fromProblem(...), $assessment->problems);
    }
}
