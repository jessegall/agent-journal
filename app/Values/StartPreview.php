<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverSourceType;
use App\Enums\DriverVariant;
use App\Enums\ModeSourceType;

/**
 * What a start would run before it is committed: the driver it resolves to and where its family and mode came from,
 * whether it can run here and why not, whether its family runs only one mode, and the catalogue revision it was read
 * from, which the commit compares again.
 */
final readonly class StartPreview
{
    public function __construct(
        public SelectedDriver $selection,
        public DriverVariant $mode,
        public ModeSourceType $modeSource,
        // None when the family does not run the mode; the unavailable reason then says so.
        public string|null $driverKey,
        public string $label,
        public string|null $unavailableReason,
        public bool $isModeLocked,
        public int $catalogueRevision,
    ) {}

    public function familySource(): DriverSourceType
    {
        return $this->selection->source->driverSource;
    }

    public function canRun(): bool
    {
        return $this->unavailableReason === null;
    }
}
