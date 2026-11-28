<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Web\Creation\Exceptions\MissingFields;

final class BooksPageDataFields
{
    /** @var list<string> */
    private array $titles;

    /** @param list<string> $titles */
    public function titles(array $titles): self
    {
        $this->titles = $titles;

        return $this;
    }

    public function finish(): BooksPageData
    {
        if (! isset($this->titles)) {
            throw MissingFields::forType(BooksPageData::class, 'titles');
        }

        return new BooksPageData(
            titles: $this->titles,
        );
    }
}
