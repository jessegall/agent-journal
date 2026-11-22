<?php

declare(strict_types=1);

namespace App\Drivers\Values;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Enums\DriverCapability;

/**
 * One registered driver: its opaque key, the family and mode it is chosen by, the label the user reads, the protocols it
 * speaks and the class that reports what it can do. Family, mode and label are for choosing and showing only.
 */
final readonly class DriverRegistration
{
    /**
     * @param  string  $family  the family's stable key, such as claude-code, shared by a terminal and a headless sibling
     * @param  list<string>  $buildPins  the approved builds of the driver's executable; none pins no build
     * @param  string  $hookProtocol  the key of the native hook codec the driver's hooks speak
     * @param  string  $accountProtocol  the key of the account provider that signs the driver in
     * @param  string  $skillProtocol  the key of the skill format the driver reads
     * @param  class-string<DriverCapabilities>  $capabilities
     * @param  list<DriverCapability>  $profileRequirements  the operations every profile on the driver needs
     */
    public function __construct(
        public DriverKey $key,
        public string $family,
        public DriverVariant $mode,
        public string $label,
        public int $protocolVersion,
        public array $buildPins,
        public string $hookProtocol,
        public string $accountProtocol,
        public string $skillProtocol,
        public string $capabilities,
        public array $profileRequirements,
    ) {}

    public function sharesModeWith(self $other): bool
    {
        return $this->family === $other->family && $this->mode === $other->mode;
    }
}
