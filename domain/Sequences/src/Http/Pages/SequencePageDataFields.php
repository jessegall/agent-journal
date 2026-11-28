<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class SequencePageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): SequencePageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(SequencePageData::class, 'shown');
        }

        return new SequencePageData(shown: $this->shown);
    }
}
