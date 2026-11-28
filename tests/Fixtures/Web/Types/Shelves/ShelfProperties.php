<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types\Shelves;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Tests\Fixtures\Web\Types\BookData;

trait ShelfProperties
{
    /**
     * @param  list<BookData>  $books
     */
    public function __construct(
        #[DataCollectionOf(BookData::class)]
        public readonly array $books,
    ) {}
}
