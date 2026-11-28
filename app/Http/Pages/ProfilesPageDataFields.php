<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ProfilesPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ProfilesPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ProfilesPageData::class, 'shown');
        }

        return new ProfilesPageData(shown: $this->shown);
    }
}
