<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class SettingsPageData extends LayoutPageData
{
    /** @use Buildable<SettingsPageDataFields> */
    use Buildable;

    protected const string FIELDS = SettingsPageDataFields::class;
}
