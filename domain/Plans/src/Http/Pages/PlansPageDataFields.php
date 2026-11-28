<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class PlansPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): PlansPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(PlansPageData::class, 'shown');
        }

        return new PlansPageData(shown: $this->shown);
    }
}
