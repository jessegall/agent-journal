<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use Spatie\LaravelData\Data;

final class BooksPageData extends Data
{
    /** @use \App\Web\Creation\Buildable<BooksPageDataFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = BooksPageDataFields::class;

    /** @param list<string> $titles */
    public function __construct(
        public readonly array $titles,
    ) {}
}
