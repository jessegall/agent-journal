<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Spatie\LaravelData\Data;

final class BookPageData extends Data
{
    /** @use \App\Web\Creation\Buildable<BookPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = BookPageDataFields::class;

    /** @param list<string> $titles */
    public function __construct(
        public readonly array $titles,
    ) {}
}
