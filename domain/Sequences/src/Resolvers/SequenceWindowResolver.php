<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Exceptions\SequenceMissing;
use Domain\Sequences\Http\Requests\SequenceRequest;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Models\SequenceRun;
use Domain\Sequences\Resolvers\Support\SequenceIndexLayout;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The Sequences page with one sequence chosen, as the design's reader draws it: its steps, each with when it runs and
 * when it is done, and its runs, each linking to its run page with the step a running one is on.
 */
final readonly class SequenceWindowResolver implements PageResolver
{
    private const int RUN_LIMIT = 20;

    public function __construct(
        private SequenceRequest $request,
        private SequenceIndexLayout $index,
    ) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $sequence = Sequence::byId($this->request->sequenceId());
        } catch (SequenceMissing $missing) {
            throw new NotFoundHttpException(previous: $missing);
        }

        $reader = DetailPage::make($sequence->name)
            ->above(LayoutPartData::text('version', "version {$sequence->version}", 'muted'))
            ->withActions(LayoutPartData::action(
                'edit-steps',
                'Edit steps',
                LayoutActionData::to(route('sequences.edit', ['sequence' => $sequence->id], false)),
                'bordered',
            ))
            ->withStanding(
                LayoutPartData::text('steps-title', 'Steps', 'heading'),
                LayoutPartData::collection('steps', 'list', $this->stepRows($sequence)),
                LayoutPartData::text('runs-title', 'Runs', 'heading'),
                ...$this->runParts($sequence),
            )
            ->part();

        return $this->index->of($sequence->id, [$reader]);
    }

    /**
     * @return list<LayoutRowData>
     */
    private function stepRows(Sequence $sequence): array
    {
        return array_map(fn (SequenceStepData $step) => new LayoutRowData(
            $step->id,
            $step->title,
            detail: "Runs when {$step->runsWhen} · done when {$step->doneWhen}",
        ), $sequence->stepList());
    }

    /**
     * @return list<LayoutPartData>
     */
    private function runParts(Sequence $sequence): array
    {
        $runs = $sequence->runs()->limit(self::RUN_LIMIT)->get()->all();

        if ($runs === []) {
            return [LayoutPartData::notice('no-runs', 'empty', 'No runs yet.')];
        }

        return [LayoutPartData::collection('runs', 'list', array_map(fn (SequenceRun $run) => new LayoutRowData(
            $run->id,
            "Run {$run->number}",
            href: route('sequences.run', ['run' => $run->number], false),
            trailing: [
                $run->state === SequenceRunState::Running
                    ? LayoutPartData::text('step', $run->stepLine($run->current_step), 'chip')
                    : LayoutPartData::badge('state', ucfirst($run->state->value), 'quiet'),
            ],
        ), $runs))];
    }
}
