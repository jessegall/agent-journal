<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Sequences;

use App\Contracts\Navigation\DraftProducers;
use App\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutDialogData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\LayoutWaysData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use Domain\Sequences\Models\Sequence;

/**
 * The Sequences page as the design draws it: the stored sequences, newest first, each a two-line row of its name and
 * its step count with what it is about, beside the reader of the one chosen.
 */
final readonly class SequencesIndex
{
    private const int LIST_LIMIT = 200;

    public function __construct(private DraftProducers $producers) {}

    /**
     * @param  list<LayoutPartData>  $reader  the chosen sequence's reader, none for the index address
     */
    public function of(string $chosenId, array $reader): DeclaredLayoutData
    {
        $sequences = array_values(Sequence::query()->latest()->readUpTo(self::LIST_LIMIT)->get()->all());

        return ListPage::make(
            'Sequences',
            array_map(fn (Sequence $sequence) => LayoutRowData::from([
                'key' => $sequence->id,
                'label' => $sequence->name,
                'detail' => $this->detailOf($sequence),
                'href' => route('sequences.sequence', ['sequence' => $sequence->id], false),
                'isCurrent' => $sequence->id === $chosenId,
            ]), $sequences),
            ListEmpty::nothingYet(
                'No sequences yet',
                'A sequence is a list of steps an agent follows the same way each time.',
                'sequence',
                LayoutPartData::action(
                    'first',
                    'New sequence',
                    LayoutActionData::to(route('sequences.new', [], false)),
                    'primary',
                ),
            ),
        )
            ->counting(count($sequences))
            ->creatingWith($this->creation())
            ->withReader(
                LayoutBackData::from(['href' => route('sequences.index', [], false), 'label' => 'Sequences']),
                ...$reader,
            )
            ->layout();
    }

    /**
     * The row's second line: how many steps the sequence has, then what it is about when it says.
     */
    private function detailOf(Sequence $sequence): string
    {
        $count = count($sequence->stepList());
        $steps = $count === 1 ? '1 step' : "{$count} steps";

        return $sequence->summary === '' ? $steps : "{$steps} · {$sequence->summary}";
    }

    /**
     * New sequence opens the editor; when a draft producer is registered for sequences, its chevron menu offers the
     * plain way and Build it with an agent, which asks three questions and opens the editor with the drafted steps.
     */
    private function creation(): LayoutPartData
    {
        $plain = LayoutPartData::action(
            'creation',
            'New sequence',
            LayoutActionData::to(route('sequences.new', [], false)),
            'primary',
        );

        if (! $this->producers->offersGuided('sequence')) {
            return $plain;
        }

        return LayoutPartData::dialog(
            'creation',
            LayoutDialogData::from([
                'title' => 'New sequence',
                'confirmation' => 'Draft opened in the editor',
                'guidedNoun' => 'sequence',
                'ways' => new LayoutWaysData('Write the steps yourself', 'Build it with an agent'),
            ]),
            $plain,
            LayoutFormData::from(['method' => ActionMethod::Get, 'href' => route('sequences.new', [], false)]),
            [
                LayoutPartData::field('name', 'Name', LayoutFieldData::from(['name' => 'name']), 'text'),
                LayoutPartData::field(
                    'steps',
                    'Steps, one per line',
                    LayoutFieldData::from(['name' => 'steps']),
                    'area',
                ),
                LayoutPartData::field('doneWhen', 'Done when', LayoutFieldData::from(['name' => 'doneWhen']), 'text'),
                LayoutPartData::field(
                    'draftedBy',
                    'Drafted by',
                    LayoutFieldData::from(['name' => 'draftedBy']),
                    'text',
                ),
            ],
            [LayoutPartData::action('send', 'Open in the editor', LayoutActionData::submitting(), 'primary')],
        );
    }
}
