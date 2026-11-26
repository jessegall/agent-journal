<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Isolation;

use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Values\BoundaryMechanisms;

/**
 * What each pinned driver keeps from the model's tools on each platform, as its setup's isolation part says. A
 * mechanism listed here still needs a recorded run before its item counts as enforced.
 */
final readonly class IsolationMechanisms
{
    public function __construct(private DriverProfiles $profiles) {}

    public function for(IsolationPlatform $platform, string $family): BoundaryMechanisms
    {
        return $this->profiles->ofFamily($family)->isolation()->mechanismsOn($platform);
    }
}
