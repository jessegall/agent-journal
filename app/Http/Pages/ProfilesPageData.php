<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class ProfilesPageData extends LayoutPageData
{
    /** @use Buildable<ProfilesPageDataFields> */
    use Buildable;

    protected const string FIELDS = ProfilesPageDataFields::class;
}
