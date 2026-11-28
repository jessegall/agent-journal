<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RuntimeStatusPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RuntimeStatusPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RuntimeStatusPageData::class, 'shown');
        }

        return new RuntimeStatusPageData(shown: $this->shown);
    }
}
