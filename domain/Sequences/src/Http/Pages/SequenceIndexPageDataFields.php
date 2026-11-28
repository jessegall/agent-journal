<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class SequenceIndexPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): SequenceIndexPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(SequenceIndexPageData::class, 'shown');
        }

        return new SequenceIndexPageData(shown: $this->shown);
    }
}
