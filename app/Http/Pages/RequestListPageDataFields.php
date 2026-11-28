<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RequestListPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RequestListPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RequestListPageData::class, 'shown');
        }

        return new RequestListPageData(shown: $this->shown);
    }
}
