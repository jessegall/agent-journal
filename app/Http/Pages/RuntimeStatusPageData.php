<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RuntimeStatusPageData extends LayoutPageData
{
    /** @use Buildable<RuntimeStatusPageDataFields> */
    use Buildable;

    protected const string FIELDS = RuntimeStatusPageDataFields::class;
}
