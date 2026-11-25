<?php

declare(strict_types=1);

namespace App\Values;

use App\Data\Hosts\EnrolledDescriptorData;
use App\Enums\DriverType;

/**
 * A host's advertised driver as the journal enrolled it: the registration it matched, or the reason it is unavailable.
 */
final readonly class EnrolledDescriptor
{
    private function __construct(
        public HostDescriptor $descriptor,
        public string|null $family,
        public DriverType|null $driverType,
        public string|null $unavailableReason,
    ) {}

    public static function available(HostDescriptor $descriptor, DriverRegistration $registration): self
    {
        return new self($descriptor, $registration->family, $registration->driverType, null);
    }

    public static function unavailable(
        HostDescriptor $descriptor,
        string $reason,
        DriverRegistration|null $registration,
    ): self {
        return new self($descriptor, $registration?->family, $registration?->driverType, $reason);
    }

    /**
     * The descriptor as the host row keeps it.
     */
    public function stored(): EnrolledDescriptorData
    {
        return new EnrolledDescriptorData(
            (string) $this->descriptor->key,
            $this->descriptor->build,
            $this->descriptor->arrangement,
            $this->descriptor->placement,
            $this->family,
            $this->driverType,
            $this->unavailableReason,
        );
    }
}
