<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverType;

/**
 * What a new runtime is opened with: the host and folder it runs in, the driver build and profile, the driver,
 * the first model and effort, and the content of its first delivery, if any.
 */
final readonly class RuntimeIntent
{
    public function __construct(
        public string $hostId,
        public string $folder,
        public string $driver,
        public string $driverBuild,
        public string $profile,
        public DriverType $driverType,
        public string|null $model,
        public string|null $effort,
        public string|null $firstMessage,
        public bool $savesDriverType = false,
    ) {}
}
