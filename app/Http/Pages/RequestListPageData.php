<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RequestListPageData extends LayoutPageData
{
    /** @use Buildable<RequestListPageDataFields> */
    use Buildable;

    protected const string FIELDS = RequestListPageDataFields::class;
}
