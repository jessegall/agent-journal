<?php

declare(strict_types=1);

namespace Tests\Fixtures\Web\Types;

use Spatie\LaravelData\Attributes\Computed;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\FromContainer;
use Spatie\LaravelData\Attributes\Hidden;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page object with every shape the browser contract relies on: a computed hook, a typed list, an enum, an optional
 * value and a hidden seed and service.
 */
#[TypeScript]
final class ShelfPage extends Data
{
    #[Computed]
    public int $bookCount {
        get => $this->counter->count($this->shelf);
    }

    /**
     * @param  list<BookData>  $books
     */
    public function __construct(
        #[Hidden]
        public readonly string $shelf,
        #[DataCollectionOf(BookData::class)]
        public readonly array $books,
        public readonly ShelfStatus $state,
        #[Hidden, FromContainer(ShelfCounter::class)]
        public readonly ShelfCounter $counter,
        public readonly string|Optional $note = new Optional(),
    ) {}
}
