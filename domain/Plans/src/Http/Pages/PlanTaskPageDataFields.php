<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class PlanTaskPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): PlanTaskPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(PlanTaskPageData::class, 'shown');
        }

        return new PlanTaskPageData(shown: $this->shown);
    }
}
