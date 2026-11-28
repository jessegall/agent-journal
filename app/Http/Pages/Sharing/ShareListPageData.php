<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class ShareListPageData extends LayoutPageData
{
    /** @use Buildable<ShareListPageDataFields> */
    use Buildable;

    protected const string FIELDS = ShareListPageDataFields::class;
}
