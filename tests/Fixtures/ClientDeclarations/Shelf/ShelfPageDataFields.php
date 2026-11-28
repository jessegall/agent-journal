<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf;

use App\Web\Creation\Exceptions\MissingFields;

final class ShelfPageDataFields
{
    /** @var list<string> */
    private array $titles;

    /** @param list<string> $titles */
    public function titles(array $titles): self
    {
        $this->titles = $titles;

        return $this;
    }

    public function finish(): ShelfPageData
    {
        if (! isset($this->titles)) {
            throw MissingFields::forType(ShelfPageData::class, 'titles');
        }

        return new ShelfPageData(
            titles: $this->titles,
        );
    }
}
