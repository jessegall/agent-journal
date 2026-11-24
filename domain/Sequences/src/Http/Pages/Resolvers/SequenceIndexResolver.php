<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Http\Pages\Sequences\SequencesIndex;

/**
 * The Sequences page with nothing chosen: the stored sequences and Nothing selected.
 */
final readonly class SequenceIndexResolver implements PageResolver
{
    public function __construct(private SequencesIndex $index) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
