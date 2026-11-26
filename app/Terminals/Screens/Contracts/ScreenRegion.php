<?php

declare(strict_types=1);

namespace App\Terminals\Screens\Contracts;

use App\Hosts\Data\HostFrameData;
use App\Terminals\Screens\RowRange;

/**
 * A part of a driver's screen found by its shape, such as its composer or an option list.
 */
interface ScreenRegion
{
    /**
     * The name the region is known by, such as composer.
     */
    public function name(): string;

    /**
     * The rows the region takes on the frame; none while it is not drawn.
     */
    public function rowsOf(HostFrameData $frame): RowRange|null;
}
