<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RequestPageData extends LayoutPageData
{
    /** @use Buildable<RequestPageDataFields> */
    use Buildable;

    protected const string FIELDS = RequestPageDataFields::class;
}
