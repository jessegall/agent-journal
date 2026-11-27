<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

/**
 * The folder of a driver's image recipe under the project, and the driver version it installs: what each host builds
 * once and every contained start of the driver runs.
 */
final readonly class DriverImage
{
    private function __construct(public string $folder, public string $version) {}

    public static function at(string $folder, string $version): self
    {
        return new self($folder, $version);
    }
}
