<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class PlansPageData extends LayoutPageData
{
    /** @use Buildable<PlansPageDataFields> */
    use Buildable;

    protected const string FIELDS = PlansPageDataFields::class;
}
