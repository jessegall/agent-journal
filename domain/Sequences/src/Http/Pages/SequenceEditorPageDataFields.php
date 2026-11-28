<?php

declare(strict_types=1);

namespace Domain\Sequences\Http\Pages;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class SequenceEditorPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): SequenceEditorPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(SequenceEditorPageData::class, 'shown');
        }

        return new SequenceEditorPageData(shown: $this->shown);
    }
}
