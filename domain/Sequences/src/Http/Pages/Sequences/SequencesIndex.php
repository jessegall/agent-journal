<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Sequences;

use App\Http\Pages\CreationDialog;
use App\Navigation\Contracts\DraftProducers;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use Domain\Sequences\Models\Sequence;

/**
 * The Sequences page as the design draws it: the stored sequences, newest first, each a two-line row of its name and
 * its step count with what it is about, beside the reader of the one chosen.
 */
final readonly class SequencesIndex extends SequencesPage
{
    private const int LIST_LIMIT = 200;

    public function __construct(private DraftProducers $producers) {}

    /**
     * @param  list<LayoutPartData>  $reader  the chosen sequence's reader, none for the index address
     */
    public function of(string $chosenId, array $reader): DeclaredLayoutData
    {
        $sequences = array_values(Sequence::query()->newestCreatedFirst()->limit(self::LIST_LIMIT)->get()->all());

        return ListPage::build()
            ->title('Sequences')
            ->rows(
                $sequences,
                fn (Sequence $sequence) => LayoutRowData::build()
                ->key($sequence->id)
                ->label($sequence->name)
                ->detail($this->detailOf($sequence))
                ->href(route('sequences.sequence', ['sequence' => $sequence->id], false))
                ->isCurrent($sequence->id === $chosenId)
                ->finish(),
            )
            ->empty(
                ListEmpty::build()
                ->title('No sequences yet')
                ->detail('A sequence is a list of steps an agent follows the same way each time.')
                ->icon('sequence')
                ->actions(
                    [LayoutPartData::build()
                    ->asAction()
                    ->key('first')
                    ->label('New sequence')
                    ->action(LayoutActionData::build()->href(route('sequences.new', [], false))->finish())
                    ->style('primary')
                    ->finish()],
                )
                ->fillsPage(true)
                ->finish(),
            )
            ->countingRows()
            ->creatingWith($this->creation())
            ->withReader(
                LayoutBackData::build()->href(route('sequences.index', [], false))->label('Sequences')->finish(),
                ...$reader,
            )
            ->finish();
    }

    /**
     * The row's second line: how many steps the sequence has, then what it is about when it says.
     */
    private function detailOf(Sequence $sequence): string
    {
        $count = count($sequence->stepList());
        $steps = $count === 1 ? '1 step' : "{$count} steps";

        if ($sequence->summary === '') {
            return $steps;
        }

        return "{$steps} · {$sequence->summary}";
    }

    /**
     * New sequence opens the editor; when a draft producer is registered for sequences, its chevron menu offers the
     * plain way and Build it with an agent, which asks three questions and opens the editor with the drafted steps.
     */
    private function creation(): LayoutPartData
    {
        $plain = LayoutPartData::build()
            ->asAction()
            ->key('creation')
            ->label('New sequence')
            ->action(LayoutActionData::build()->href(route('sequences.new', [], false))->finish())
            ->style('primary')
            ->finish();

        if (! $this->producers->offersGuided('sequence')) {
            return $plain;
        }

        $creation = CreationDialog::build()
            ->key('creation')
            ->title('New sequence')
            ->confirmation('Draft opened in the editor')
            ->sendLabel('Open in the editor')
            ->guidedNoun('sequence')
            ->plainWay('Write the steps yourself')
            ->guidedWay('Build it with an agent')
            ->waysInHeader(true)
            ->finish();

        return $this->creationDialog(
            $creation,
            $plain,
            LayoutFormData::build()
                ->method(ActionMethod::Get)
                ->href(route('sequences.new', [], false))
                ->finish(),
            [
                LayoutPartData::build()
                    ->asField()
                    ->key('name')
                    ->label('Name')
                    ->field(LayoutFieldData::build()->name('name')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('steps')
                    ->label('Steps, one per line')
                    ->field(LayoutFieldData::build()->name('steps')->finish())
                    ->style('area')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('doneWhen')
                    ->label('Done when')
                    ->field(LayoutFieldData::build()->name('doneWhen')->finish())
                    ->style('text')
                    ->finish(),
                LayoutPartData::build()
                    ->asField()
                    ->key('draftedBy')
                    ->label('Drafted by')
                    ->field(LayoutFieldData::build()->name('draftedBy')->finish())
                    ->style('text')
                    ->finish(),
            ],
        );
    }
}
