<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ProfilePageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ProfilePageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ProfilePageData::class, 'shown');
        }

        return new ProfilePageData(shown: $this->shown);
    }
}
