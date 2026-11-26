<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ExecutionModeType;

/**
 * A start as proposed before it is admitted: the profile's decisions, the driver, build, driver type and model asked
 * for, and the placement its start policy gives.
 */
final readonly class StartProposal
{
    public function __construct(
        public ProfileDefaults $profile,
        public string $driver,
        public string $build,
        public DriverType $driverType,
        public ExecutionModeType $placement,
        public string|null $model,
    ) {}

    public function isContained(): bool
    {
        return $this->placement === ExecutionModeType::RequiredContainer;
    }
}
