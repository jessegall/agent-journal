<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class ShareDetailPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): ShareDetailPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(ShareDetailPageData::class, 'shown');
        }

        return new ShareDetailPageData(shown: $this->shown);
    }
}
