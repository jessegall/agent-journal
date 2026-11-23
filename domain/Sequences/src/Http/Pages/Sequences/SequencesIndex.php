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
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use Domain\Sequences\Http\Pages\SequencePageViews;
use Domain\Sequences\Models\Sequence;
use Spatie\LaravelData\Optional;

/**
 * The Sequences page as the design draws it: the stored sequences, newest first, each a two-line row of its name and
 * summary, beside the reader of the one chosen.
 */
final readonly class SequencesIndex
{
    private const int LIST_LIMIT = 200;

    public function __construct(private DraftProducers $producers, private SequencePageViews $views) {}

    /**
     * @param  list<LayoutPartData>  $reader  the chosen sequence's reader, none for the index address
     */
    public function of(string $chosenId, array $reader): DeclaredLayoutData
    {
        $sequences = array_values(Sequence::query()->latest()->readUpTo(self::LIST_LIMIT)->get()->all());

        return ListPage::make(
            'Sequences',
            array_map(fn (Sequence $sequence) => new LayoutRowData(
                $sequence->id,
                $sequence->name,
                detail: $sequence->summary === '' ? Optional::create() : $sequence->summary,
                href: route('sequences.sequence', ['sequence' => $sequence->id], false),
                isCurrent: $sequence->id === $chosenId,
            ), $sequences),
            ListEmpty::informing('No sequences yet.', 'Sequences the agents follow appear here once one is written.'),
        )
            ->counting(count($sequences))
            ->withViews(...$this->views->of(false))
            ->creatingWith(...$this->creations())
            ->withReader(new LayoutBackData(route('sequences.index', [], false), 'Sequences'), ...$reader)
            ->layout();
    }

    /**
     * New sequence opens the editor; beside it, when a draft producer is registered for sequences, Guided asks three
     * questions and opens the editor with the drafted steps.
     *
     * @return list<LayoutPartData>
     */
    private function creations(): array
    {
        $plain = LayoutPartData::action(
            'creation',
            'New sequence',
            LayoutActionData::to(route('sequences.new', [], false)),
            'primary',
        );

        if (! $this->producers->offersGuided('sequence')) {
            return [$plain];
        }

        $guided = LayoutPartData::dialog(
            'guided-sequence',
            new LayoutDialogData('Guided sequence', 'Draft opened in the editor', guidedNoun: 'sequence'),
            LayoutPartData::action('open', 'Guided', LayoutActionData::changing([])),
            new LayoutFormData(ActionMethod::Get, route('sequences.new', [], false)),
            [
                LayoutPartData::field('name', 'Name', new LayoutFieldData('name'), 'text'),
                LayoutPartData::field('steps', 'Steps, one per line', new LayoutFieldData('steps'), 'area'),
                LayoutPartData::field('doneWhen', 'Done when', new LayoutFieldData('doneWhen'), 'text'),
                LayoutPartData::field('draftedBy', 'Drafted by', new LayoutFieldData('draftedBy'), 'text'),
            ],
            [LayoutPartData::action('send', 'Open in the editor', LayoutActionData::submitting(), 'primary')],
        );

        return [$plain, $guided];
    }
}
