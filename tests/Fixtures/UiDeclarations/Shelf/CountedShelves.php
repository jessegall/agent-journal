<?php

declare(strict_types=1);

namespace Tests\Fixtures\UiDeclarations\Shelf;

use App\Core\Ui\Contracts\CountReader;

final readonly class CountedShelves implements CountReader
{
    public function __construct(private ReaderCalls $calls) {}

    public function count(): int
    {
        $this->calls->readers[] = 'count';

        return 4;
    }
}
