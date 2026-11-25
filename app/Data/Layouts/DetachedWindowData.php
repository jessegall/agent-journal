<?php

declare(strict_types=1);

namespace App\Data\Layouts;

use Spatie\LaravelData\Data;

/**
 * A window floating over the grid: where it stands, its size, and whether it is minimised.
 */
final class DetachedWindowData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly float $left,
        public readonly float $top,
        public readonly float $width,
        public readonly float $height,
        public readonly bool $isMinimised,
    ) {}
}
