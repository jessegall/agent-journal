<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Drivers\Enums\HookDriver;

/**
 * One way a host can run an agent: a driver build, the arrangement and placement it runs in, and its variant.
 */
final readonly class HostCombination
{
    public function __construct(
        public HookDriver $driver,
        public string $build,
        public ArrangementType $arrangement,
        public ExecutionModeType $placement,
        public DriverVariant $variant,
    ) {}

    /**
     * @return array{driver: string, build: string, arrangement: string, placement: string, variant: string}
     */
    public function stored(): array
    {
        return [
            'driver' => $this->driver->value,
            'build' => $this->build,
            'arrangement' => $this->arrangement->value,
            'placement' => $this->placement->value,
            'variant' => $this->variant->value,
        ];
    }
}
