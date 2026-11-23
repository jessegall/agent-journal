<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Sequences;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Models\Sequence;

/**
 * The Sequences page with one sequence chosen, as the design's reader draws it: its name, what it is about and its
 * numbered steps, each with when it runs and when it is done. Its runs are not here: a running sequence is a window on
 * Home.
 */
final readonly class SequencesShow
{
    public function __construct(private SequencesIndex $index) {}

    public function of(Sequence $sequence): DeclaredLayoutData
    {
        $page = DetailPage::make($sequence->name);
        $about = $sequence->summary === '' ? $page : $page->summarising($sequence->summary);

        $reader = $about
            ->withActions(LayoutPartData::action(
                'edit-steps',
                'Edit steps',
                LayoutActionData::to(route('sequences.edit', ['sequence' => $sequence->id], false)),
                'bordered',
            ))
            ->withStanding(LayoutPartData::collection('steps', 'list', $this->stepRows($sequence)))
            ->part();

        return $this->index->of($sequence->id, [$reader]);
    }

    /**
     * @return list<LayoutRowData>
     */
    private function stepRows(Sequence $sequence): array
    {
        return array_map(
            fn (SequenceStepData $step, int $index) => LayoutRowData::from(
                [
                    'key' => $step->id,
                    'label' => $step->title,
                    'detail' => "Runs when {$step->runsWhen} · done when {$step->doneWhen}",
                    'leading' => [LayoutPartData::text('number', (string) ($index + 1), 'muted')],
                ],
            ),
            $sequence->stepList(),
            array_keys($sequence->stepList()),
        );
    }
}
