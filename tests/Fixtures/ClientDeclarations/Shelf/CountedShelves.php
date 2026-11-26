<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Records\Contracts\CountResolver;

final readonly class CountedShelves implements CountResolver
{
    public function __construct(private ReaderCalls $calls) {}

    public function count(): int
    {
        $this->calls->readers[] = 'count';

        return 4;
    }
}
