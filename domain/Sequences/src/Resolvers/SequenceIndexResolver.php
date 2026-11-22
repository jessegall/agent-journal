<?php

declare(strict_types=1);

namespace Domain\Sequences\Resolvers;

use App\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use Domain\Sequences\Resolvers\Support\SequenceIndexLayout;

/**
 * The Sequences page with nothing chosen: the stored sequences and Nothing selected.
 */
final readonly class SequenceIndexResolver implements PageResolver
{
    public function __construct(private SequenceIndexLayout $index) {}

    public function read(): DeclaredLayoutData
    {
        return $this->index->of('', []);
    }
}
