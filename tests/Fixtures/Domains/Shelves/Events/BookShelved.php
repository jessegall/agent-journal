<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves\Events;

use App\Contracts\Events\Event;

final readonly class BookShelved implements Event
{
    public function __construct(public int $bookId) {}
}
