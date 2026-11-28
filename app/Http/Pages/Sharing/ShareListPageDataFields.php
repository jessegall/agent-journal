<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ShareListPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ShareListPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ShareListPageData::class, 'shown');
        }

        return new ShareListPageData(shown: $this->shown);
    }
}
