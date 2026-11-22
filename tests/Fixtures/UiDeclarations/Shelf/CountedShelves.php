<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Contracts\Records\CountResolver;

final readonly class CountedShelves implements CountResolver
{
    public function __construct(private ReaderCalls $calls) {}

    public function count(): int
    {
        $this->calls->readers[] = 'count';

        return 4;
    }
}
