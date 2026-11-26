<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Actors\Contracts\ActorVisibility;
use App\Support\Layout\LayoutRowData;

/**
 * The two views beside the Sequences header: the sequences, and the runs for a caller who may read every owner's runs.
 */
final readonly class SequencePageViews
{
    public function __construct(private ActorVisibility $visibility) {}

    /**
     * @return list<LayoutRowData>
     */
    public function of(bool $isRuns): array
    {
        if (! $this->visibility->canReadAcrossOwners()) {
            return [];
        }

        return [
            LayoutRowData::from([
                'key' => 'sequences',
                'label' => 'Sequences',
                'href' => route('sequences.index', [], false),
                'isCurrent' => ! $isRuns,
            ]),
            LayoutRowData::from([
                'key' => 'runs',
                'label' => 'Runs',
                'href' => route('sequences.runs', [], false),
                'isCurrent' => $isRuns,
            ]),
        ];
    }
}
