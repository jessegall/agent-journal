<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Sequences;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\Sequence;
use Domain\Sequences\Models\SequenceRun;

/**
 * The Sequences page with one sequence chosen, as the design's reader draws it: its steps, each with when it runs and
 * when it is done, and its runs, each linking to its run page with the step a running one is on.
 */
final readonly class SequencesShow
{
    public function __construct(private SequencesIndex $index) {}

    /**
     * @param  list<SequenceRun>  $runs
     */
    public function of(Sequence $sequence, array $runs): DeclaredLayoutData
    {
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
                ...$this->runParts($runs),
            )
            ->part();

        return $this->index->of($sequence->id, [$reader]);
    }

    /**
     * @return list<LayoutRowData>
     */
    private function stepRows(Sequence $sequence): array
    {
        return array_map(
            fn (SequenceStepData $step) => LayoutRowData::from(
                ['key' => $step->id, 'label' => $step->title, 'detail' => "Runs when {$step->runsWhen} · done when {$step->doneWhen}"],
            ),
            $sequence->stepList(),
        );
    }

    /**
     * @param  list<SequenceRun>  $runs
     * @return list<LayoutPartData>
     */
    private function runParts(array $runs): array
    {
        if ($runs === []) {
            return [LayoutPartData::notice('no-runs', 'empty', 'No runs yet.')];
        }

        return [LayoutPartData::collection('runs', 'list', array_map(fn (
            SequenceRun $run,
        ) => LayoutRowData::from([
            'key' => $run->id,
            'label' => "Run {$run->number}",
            'href' => route(
                'sequences.run',
                ['run' => $run->number],
                false,
            ),
            'trailing' => [
                $run->state === SequenceRunState::Running
                    ? LayoutPartData::text('step', $run->stepLine($run->current_step), 'chip')
                    : LayoutPartData::badge('state', ucfirst($run->state->value), 'quiet'),
            ],
        ]), $runs))];
    }
}
