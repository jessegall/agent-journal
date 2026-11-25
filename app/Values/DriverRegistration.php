<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverType;

/**
 * One registered driver: its opaque key, the family and driver type it is chosen by, the label the user reads, the protocols it
 * speaks and the class that reports what it can do. Family, driver type and label are for choosing and showing only.
 */
final readonly class DriverRegistration
{
    /**
     * @param  string  $family  the family's stable key, such as claude-code, shared by a terminal and a headless sibling
     * @param  list<string>  $buildPins  the approved builds of the driver's executable; none pins no build
     * @param  string  $hookProtocol  the key of the native hook codec the driver's hooks speak
     * @param  string  $accountProtocol  the key of the account provider that signs the driver in
     * @param  string  $skillProtocol  the key of the skill format and installer the driver reads, one per family
     * @param  class-string<DriverCapabilities>  $capabilities
     * @param  list<DriverCapability>  $profileRequirements  the operations every profile on the driver needs
     */
    public function __construct(
        public DriverKey $key,
        public string $family,
        public DriverType $driverType,
        public string $label,
        public array $buildPins,
        public string $hookProtocol,
        public string $accountProtocol,
        public string $skillProtocol,
        public string $capabilities,
        public array $profileRequirements,
    ) {}

    public function sharesModeWith(self $other): bool
    {
        return $this->family === $other->family && $this->driverType === $other->driverType;
    }
}
