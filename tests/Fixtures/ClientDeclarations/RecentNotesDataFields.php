<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations;

use App\Web\Creation\Exceptions\MissingFields;

final class RecentNotesDataFields
{
    /** @var list<string> */
    private array $titles;

    /** @param list<string> $titles */
    public function titles(array $titles): self
    {
        $this->titles = $titles;

        return $this;
    }

    public function finish(): RecentNotesData
    {
        if (! isset($this->titles)) {
            throw MissingFields::forType(RecentNotesData::class, 'titles');
        }

        return new RecentNotesData(
            titles: $this->titles,
        );
    }
}
