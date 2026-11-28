<?php

declare(strict_types=1);

namespace App\Http\Pages\Sharing;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class ShareDetailPageData extends LayoutPageData
{
    /** @use Buildable<ShareDetailPageDataFields> */
    use Buildable;

    protected const string FIELDS = ShareDetailPageDataFields::class;
}
