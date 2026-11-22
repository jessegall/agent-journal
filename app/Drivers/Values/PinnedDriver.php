<?php

declare(strict_types=1);

namespace App\Drivers\Values;

/**
 * The registration a start runs on, with the catalogue revision it was chosen from; a start record keeps both.
 */
final readonly class PinnedDriver
{
    public function __construct(
        public DriverRegistration $registration,
        public int $catalogueRevision,
    ) {}
}
