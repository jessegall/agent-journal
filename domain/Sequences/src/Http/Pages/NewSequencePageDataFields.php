<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class NewSequencePageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): NewSequencePageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(NewSequencePageData::class, 'shown');
        }

        return new NewSequencePageData(shown: $this->shown);
    }
}
