<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers\Support;

use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPage;
use Domain\Sequences\Models\Sequence;

/**
 * The Sequences page as the design draws it: the stored sequences, newest first, each a two-line row of its name and
 * summary, beside the reader of the one chosen.
 */
final readonly class SequenceIndexLayout
{
    /**
     * @param  list<LayoutPartData>  $reader  the chosen sequence's reader, none for the index address
     */
    public function of(string $chosenId, array $reader): DeclaredLayoutData
    {
        $sequences = Sequence::query()->get()->all();

        return ListPage::make(
            'Sequences',
            array_map(fn (Sequence $sequence) => new LayoutRowData(
                $sequence->id,
                $sequence->name,
                detail: $sequence->summary === '' ? null : $sequence->summary,
                href: route('sequences.sequence', ['sequence' => $sequence->id], false),
                isCurrent: $sequence->id === $chosenId,
            ), $sequences),
            ListEmpty::informing('No sequences yet.', 'Sequences the agents follow appear here once one is written.'),
        )
            ->counting(count($sequences))
            ->creating('New sequence', LayoutActionData::to(route('sequences.new', [], false)))
            ->withReader(new LayoutBackData(route('sequences.index', [], false), 'Sequences'), ...$reader)
            ->layout();
    }
}
