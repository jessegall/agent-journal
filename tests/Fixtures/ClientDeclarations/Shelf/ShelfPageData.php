<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use Spatie\LaravelData\Data;

final class ShelfPageData extends Data
{
    /** @use \App\Web\Creation\Buildable<ShelfPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ShelfPageDataFields::class;

    /** @param list<string> $titles */
    public function __construct(
        public readonly array $titles,
    ) {}
}
