<?php

declare(strict_types=1);

namespace Tests\Fixtures\ClientDeclarations\Shelf\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ShelfLayoutPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ShelfLayoutPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ShelfLayoutPageData::class, 'shown');
        }

        return new ShelfLayoutPageData(
            shown: $this->shown,
        );
    }
}
