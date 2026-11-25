<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\ArrangementType;
use Spatie\LaravelData\Data;

/**
 * One driver a host enrolled, as the host row keeps it: the build and where it runs, the family and driver type of the
 * catalogue registration it matched, and why it is unavailable when it is.
 */
final class EnrolledDescriptorData extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $build,
        public readonly ArrangementType $arrangement,
        public readonly ExecutionModeType $placement,
        public readonly string|null $family,
        public readonly DriverType|null $driverType,
        public readonly string|null $unavailableReason,
    ) {}

    public function isAvailable(): bool
    {
        return $this->unavailableReason === null;
    }

    /**
     * Whether it is an available build of the driver family, of the driver type, in the arrangement and placement.
     */
    public function runs(
        string $family,
        string $build,
        ArrangementType $arrangement,
        ExecutionModeType $placement,
        DriverType $driverType,
    ): bool {
        return $this->isOfAvailableFamily($family)
            && $this->driverType === $driverType
            && $this->build === $build
            && $this->arrangement === $arrangement
            && $this->placement === $placement;
    }

    public function isOfAvailableFamily(string $family): bool
    {
        return $this->isAvailable() && $this->family === $family;
    }
}
