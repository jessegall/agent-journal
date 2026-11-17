<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves\Events;

final readonly class BookShelved
{
    public function __construct(public int $bookId) {}
}
