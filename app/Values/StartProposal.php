<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;

/**
 * A start as proposed before it is admitted: the profile's decisions, the driver, build, variant and model asked
 * for, and the placement its launch policy gives.
 */
final readonly class StartProposal
{
    public function __construct(
        public ProfileDefaults $profile,
        public string $driver,
        public string $build,
        public DriverVariant $variant,
        public ExecutionModeType $placement,
        public string|null $model,
    ) {}

    public function isDriverPinnedAway(): bool
    {
        return $this->profile->driverPinned && $this->profile->driver !== $this->driver;
    }

    public function isModelRefused(): bool
    {
        return $this->model !== null && ! $this->profile->allows($this->model);
    }

    public function isContained(): bool
    {
        return $this->placement === ExecutionModeType::RequiredContainer;
    }
}
