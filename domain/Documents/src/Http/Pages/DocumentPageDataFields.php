<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Support\Layout\RecordLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class DocumentPageDataFields
{
    private RecordLayoutData $shown;

    public function shown(RecordLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): DocumentPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(DocumentPageData::class, 'shown');
        }

        return new DocumentPageData(shown: $this->shown);
    }
}
