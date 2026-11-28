<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Support\Layout\DeclaredLayoutData;
use App\Web\Creation\Exceptions\MissingFields;

final class GatewaySettingsPageDataFields
{
    private DeclaredLayoutData $shown;

    public function shown(DeclaredLayoutData $shown): self
    {
        $this->shown = $shown;

        return $this;
    }

    public function finish(): GatewaySettingsPageData
    {
        if (! isset($this->shown)) {
            throw MissingFields::forType(GatewaySettingsPageData::class, 'shown');
        }

        return new GatewaySettingsPageData(shown: $this->shown);
    }
}
