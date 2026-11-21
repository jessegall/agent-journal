<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Drivers\Enums\HookDriver;

/**
 * A start as proposed before it is admitted: the profile's decisions, the driver, build, variant and model asked
 * for, and the placement its launch policy gives.
 */
final readonly class StartProposal
{
    public function __construct(
        public ProfileDefaults $profile,
        public HookDriver $driver,
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

    public function isContainedCodex(): bool
    {
        return $this->driver === HookDriver::Codex && $this->placement === ExecutionModeType::RequiredContainer;
    }
}
