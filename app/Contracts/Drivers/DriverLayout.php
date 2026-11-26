<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Support\Screens\ScreenLayout;

/**
 * How a driver's pinned build draws its terminal.
 */
interface DriverLayout
{
    /**
     * The layout of the driver's terminal, as its recordings measured it.
     */
    public function __invoke(): ScreenLayout;
}
