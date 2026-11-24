<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Shelves\Listeners;

use Tests\Fixtures\Domains\Shelves\Events\BookShelved;

final class CountBookShelved
{
    public function handle(BookShelved $event): void {}
}
