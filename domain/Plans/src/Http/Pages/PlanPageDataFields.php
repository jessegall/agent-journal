<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class PlanPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): PlanPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(PlanPageData::class, 'shown');
        }

        return new PlanPageData(shown: $this->shown);
    }
}
