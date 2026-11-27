<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Enums\ScreenType;

/**
 * One reading of a driver's screen: what it is ready for, the menu family when one shows, whether the region it rests
 * on has held still for its interval, and whether an option list is drawn with no composer, as a picker is.
 */
final readonly class ScreenReading
{
    public function __construct(
        public ScreenType $type,
        public MenuFamily|null $menu,
        public bool $isStill,
        public bool $hasOptions,
    ) {}

    /**
     * The rows of the menu's options on the frame, none when no menu shows or its options are not drawn.
     */
    public function menuRowsOf(HostFramePayload $frame): RowRange|null
    {
        return $this->menu?->options->rowsOf($frame);
    }
}
