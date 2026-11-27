<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

/**
 * The folder of a driver's image recipe under the project, whose VERSION file pins the driver it installs: what each
 * host builds once and every contained start of the driver runs.
 */
final readonly class DriverImage
{
    private function __construct(public string $folder) {}

    public static function at(string $folder): self
    {
        return new self($folder);
    }
}
