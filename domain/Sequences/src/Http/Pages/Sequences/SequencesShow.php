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
 * numbered steps, each with when it runs and when it is done.
 */
final readonly class SequencesShow extends SequencesPage
{
    public function __construct(private SequencesIndex $index) {}

    public function of(Sequence $sequence): DeclaredLayoutData
    {
        $page = DetailPage::build()->title($sequence->name)->finish();
        $summarisedPage = $sequence->summary === '' ? $page : $page->summarising($sequence->summary);

        $reader = $summarisedPage
            ->withActions(LayoutPartData::build()
                ->asAction()
                ->key('edit-steps')
                ->label('Edit steps')
                ->action(
                    LayoutActionData::build()
                    ->href(route('sequences.edit', ['sequence' => $sequence->id], false))
                    ->finish(),
                )
                ->style('bordered')
                ->finish())
            ->withStanding(LayoutPartData::build()
                ->asCollection()
                ->key('steps')
                ->style('list')
                ->rows($this->stepRows($sequence))
                ->finish())
            ->part();

        return $this->index->of($sequence->id, [$reader]);
    }

    /**
     * @return list<LayoutRowData>
     */
    private function stepRows(Sequence $sequence): array
    {
        return array_map(
            fn (SequenceStepData $step, int $index) => LayoutRowData::build()
                ->key($step->id)
                ->label($step->title)
                ->detail("Runs when {$step->runsWhen} · done when {$step->doneWhen}")
                ->leading(
                    [LayoutPartData::build()
                    ->asText()
                    ->key('number')
                    ->value((string) ($index + 1))
                    ->style('muted')
                    ->finish()],
                )
                ->finish(),
            $sequence->stepList(),
            array_keys($sequence->stepList()),
        );
    }
}
