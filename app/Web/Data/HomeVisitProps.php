<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Creation\Buildable;
use Inertia\AlwaysProp;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;

final class HomeVisitProps extends Data
{
    /** @use Buildable<HomeVisitPropsFields> */
    use Buildable;

    protected const string FIELDS = HomeVisitPropsFields::class;

    public function __construct(
        public readonly AlwaysProp $title,
        public readonly Lazy|Data $page,
    ) {}
}
