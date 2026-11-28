<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class SequenceRunsPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): SequenceRunsPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(SequenceRunsPageData::class, 'shown');
        }

        return new SequenceRunsPageData(shown: $this->shown);
    }
}
