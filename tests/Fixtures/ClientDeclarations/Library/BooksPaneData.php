<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Spatie\LaravelData\Data;

#[\App\Web\Attributes\WindowOnly, \App\Web\Attributes\Optional]
final class BooksPaneData extends Data
{
    /** @use \App\Web\Creation\Buildable<BooksPaneDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = BooksPaneDataFields::class;

    /** @param list<string> $titles */
    public function __construct(
        public readonly array $titles,
    ) {}
}
