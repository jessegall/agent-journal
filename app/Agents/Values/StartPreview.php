<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Drivers\Enums\DriverSourceType;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\DriverTypeSource;
use App\Values\SelectedDriver;

/**
 * What a start would run before it is committed: the driver it resolves to and where its family and driver type came from,
 * whether it can run here and why not, whether its family runs only one driver type, and the catalogue revision it was read
 * from, which the commit compares again.
 */
final readonly class StartPreview
{
    public function __construct(
        public SelectedDriver $selection,
        public DriverType $driverType,
        public DriverTypeSource $driverTypeSource,
        // None when the family does not run the driver type; the unavailable reason then says so.
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
