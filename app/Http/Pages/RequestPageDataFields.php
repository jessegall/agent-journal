<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RequestPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RequestPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RequestPageData::class, 'shown');
        }

        return new RequestPageData(shown: $this->shown);
    }
}
