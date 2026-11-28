<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class TaskPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): TaskPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(TaskPageData::class, 'shown');
        }

        return new TaskPageData(shown: $this->shown);
    }
}
