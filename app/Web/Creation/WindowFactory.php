<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Creation\Contracts\WindowBuilder;
use Illuminate\Contracts\Container\Container;

/** @extends SurfaceFactory<WindowBuilder> */
final class WindowFactory extends SurfaceFactory
{
    public function __construct(Container $container)
    {
        parent::__construct($container, 'window', WindowBuilder::class);
    }
}
