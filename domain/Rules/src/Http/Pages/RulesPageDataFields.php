<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RulesPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RulesPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RulesPageData::class, 'shown');
        }

        return new RulesPageData(shown: $this->shown);
    }
}
