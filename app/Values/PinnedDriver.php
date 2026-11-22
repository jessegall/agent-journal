<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverCapability;

/**
 * The registration a start runs on, with the catalogue revision it was chosen from; a start record keeps both.
 */
final readonly class PinnedDriver
{
    public function __construct(
        public DriverRegistration $registration,
        public int $catalogueRevision,
        public SupportSnapshot $support,
    ) {}

    /**
     * Whether the pinned driver draws a screen a viewer can watch.
     */
    public function hasScreen(): bool
    {
        return $this->support->supportOf(DriverCapability::Watch)->isAllowed();
    }
}
