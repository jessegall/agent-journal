<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use App\Web\Attributes\Bounded;
use App\Web\Attributes\Paged;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

#[Paged('page', size: 2)]
final class BoundedShelfData extends Data
{
    /** @param list<BookData> $books */
    public function __construct(
        #[Bounded(2), DataCollectionOf(BookData::class)]
        public readonly array $books,
    ) {}
}
