<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Http\Requests\Processes\RunPageRequest;
use App\Processes\Data\PartOutputData;
use App\Processes\Data\ProblemData;
use App\Processes\Data\RunWindowData;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Resolvers\Support\RunSnapshotResolver;
use App\Processes\Support\StoredOutput;
use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;

/**
 * One run of the current project for its page: the live snapshot, the escaped tail of every stream of every part and
 * the problems of each part's latest assessment.
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
        $snapshot = $this->snapshots->snapshot($this->page->runId());
        $run = ProcessRun::query()->forActor()->whereKey($snapshot->runId)->firstOrFail();
        $parts = $run->parts()->readLimit(500)->get();

        $detail = new RunWindowData(
            $snapshot,
            $parts->mapWithKeys(fn (PartRun $part) => [$part->id => $this->outputsOf($part)])->all(),
            $parts->mapWithKeys(fn (PartRun $part) => [$part->id => $this->problemsOf($part)])->all(),
            $run->stop_reason,
        );

        return DeclaredLayoutData::of(LayoutPartData::box(
            'run',
            'stack',
            LayoutPartData::box('header', 'header', LayoutPartData::text('title', "Run {$snapshot->runId}", 'heading')),
            LayoutPartData::native('detail', LayoutNativeData::of('processes/RunView', $detail)),
        ));
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
