<?php

declare(strict_types=1);

namespace App\Values;

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
     * @return array{key: string, build: string, arrangement: string, placement: string,
     *     family: string|null, driver_type: string|null, unavailable_reason: string|null}
     */
    public function stored(): array
    {
        return [
            'key' => (string) $this->descriptor->key,
            'build' => $this->descriptor->build,
            'arrangement' => $this->descriptor->arrangement->value,
            'placement' => $this->descriptor->placement->value,
            'family' => $this->family,
            'driver_type' => $this->driverType?->value,
            'unavailable_reason' => $this->unavailableReason,
        ];
    }
}
