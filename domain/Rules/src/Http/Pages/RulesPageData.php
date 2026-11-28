<?php

declare(strict_types=1);

namespace Domain\Rules\Http\Pages;

use App\Web\Creation\Buildable;
use App\Web\Creation\LayoutPageData;

final class RulesPageData extends LayoutPageData
{
    /** @use Buildable<RulesPageDataFields> */
    use Buildable;

    protected const string FIELDS = RulesPageDataFields::class;
}
