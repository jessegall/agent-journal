<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class PlanTaskPageData extends LayoutPageData
{
    /** @use Buildable<PlanTaskPageDataFields> */
    use Buildable;

    protected const string FIELDS = PlanTaskPageDataFields::class;
}
