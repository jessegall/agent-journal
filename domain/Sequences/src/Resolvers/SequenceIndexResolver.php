<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;

/**
 * The sequences address with no run: no list of runs a reader may see exists yet, so it says that a run opens from an
 * authorized run link.
 */
final readonly class SequenceIndexResolver implements PageResolver
{
    public function read(): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'sequences',
            'stack',
            LayoutPartData::text('title', 'Sequences', 'heading'),
            LayoutPartData::notice(
                'entry',
                'empty',
                'A sequence run opens from its own link.',
                'Follow the link a run gives you; only runs you may read open.',
            ),
        ));
    }
}
