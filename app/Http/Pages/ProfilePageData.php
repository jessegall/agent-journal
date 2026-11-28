<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class ProfilePageData extends LayoutPageData
{
    /** @use Buildable<ProfilePageDataFields> */
    use Buildable;

    protected const string FIELDS = ProfilePageDataFields::class;
}
