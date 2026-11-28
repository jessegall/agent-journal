<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RunListPageData extends LayoutPageData
{
    /** @use Buildable<RunListPageDataFields> */
    use Buildable;

    protected const string FIELDS = RunListPageDataFields::class;
}
