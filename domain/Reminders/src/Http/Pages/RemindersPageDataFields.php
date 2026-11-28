<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class RemindersPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): RemindersPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(RemindersPageData::class, 'shown');
        }

        return new RemindersPageData(shown: $this->shown);
    }
}
