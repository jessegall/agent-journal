<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class GatewaySettingsPageData extends LayoutPageData
{
    /** @use Buildable<GatewaySettingsPageDataFields> */
    use Buildable;

    protected const string FIELDS = GatewaySettingsPageDataFields::class;
}
