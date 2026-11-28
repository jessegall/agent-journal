<?php

declare(strict_types=1);

namespace App\Web\Creation;

use App\Web\Creation\Contracts\WindowBuilder;

/** @extends SurfaceFactory<WindowBuilder> */
final class WindowFactory extends SurfaceFactory
{
    public function __construct()
    {
        parent::__construct('window', WindowBuilder::class);
    }
}
