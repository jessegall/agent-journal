<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Pages;

use App\Support\Layout\RecordLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ReportPageDataFields
{
    private RecordLayoutData $shown;

    public function shown(RecordLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ReportPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ReportPageData::class, 'shown');
        }

        return new ReportPageData(shown: $this->shown);
    }
}
