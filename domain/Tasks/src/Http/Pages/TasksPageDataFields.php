<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class TasksPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): TasksPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(TasksPageData::class, 'shown');
        }

        return new TasksPageData(shown: $this->shown);
    }
}
