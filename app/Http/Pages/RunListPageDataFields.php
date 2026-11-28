<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RunListPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RunListPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RunListPageData::class, 'shown');
        }

        return new RunListPageData(shown: $this->shown);
    }
}
