<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class PlanPageData extends LayoutPageData
{
    /** @use Buildable<PlanPageDataFields> */
    use Buildable;

    protected const string FIELDS = PlanPageDataFields::class;
}
