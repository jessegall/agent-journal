<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RunPageData extends LayoutPageData
{
    /** @use Buildable<RunPageDataFields> */
    use Buildable;

    protected const string FIELDS = RunPageDataFields::class;
}
