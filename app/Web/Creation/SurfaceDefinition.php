<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Creation\Contracts\PageBuilder;
use App\Web\Creation\Contracts\WindowBuilder;
use Spatie\LaravelData\Data;

final readonly class SurfaceDefinition
{
    /**
     * @param class-string<Data> $type
     * @param class-string<PageBuilder|WindowBuilder> $builder
     */
    public function __construct(public string $type, public string $builder, public string $component) {}
}
