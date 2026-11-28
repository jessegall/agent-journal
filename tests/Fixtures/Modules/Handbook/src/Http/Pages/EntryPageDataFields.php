<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class EntryPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): EntryPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(EntryPageData::class, 'shown');
        }

        return new EntryPageData(
            shown: $this->shown,
        );
    }
}
