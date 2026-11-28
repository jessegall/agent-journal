<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class SequenceRunPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): SequenceRunPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(SequenceRunPageData::class, 'shown');
        }

        return new SequenceRunPageData(shown: $this->shown);
    }
}
