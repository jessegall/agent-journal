<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Library;

use App\Web\Creation\Exceptions\MissingFields;

final class BooksPaneDataFields
{
    /** @var list<string> */
    private array $titles;

    /** @param list<string> $titles */
    public function titles(array $titles): self
    {
        $this->titles = $titles;

        return $this;
    }

    public function finish(): BooksPaneData
    {
        if (! isset($this->titles)) {
            throw MissingFields::forType(BooksPaneData::class, 'titles');
        }

        return new BooksPaneData(
            titles: $this->titles,
        );
    }
}
