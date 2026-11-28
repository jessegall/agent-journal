<?php

declare(strict_types=1);

namespace App\Web\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;

final class ScheduledSurfaceProp extends Data
{
    /** @use \App\Web\Creation\Buildable<ScheduledSurfacePropFields> */
    use \App\Web\Creation\Buildable;

    protected const string FIELDS = ScheduledSurfacePropFields::class;

    public function __construct(
        public readonly Lazy|Data $value,
    ) {}
}
