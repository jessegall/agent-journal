<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Web\Creation\Exceptions\MissingFields;

final class BookPageDataFields
{
    /** @var list<string> */
    private array $titles;

    /** @param list<string> $titles */
    public function titles(array $titles): self
    {
        $this->titles = $titles;

        return $this;
    }

    public function finish(): BookPageData
    {
        if (! isset($this->titles)) {
            throw MissingFields::forType(BookPageData::class, 'titles');
        }

        return new BookPageData(
            titles: $this->titles,
        );
    }
}
