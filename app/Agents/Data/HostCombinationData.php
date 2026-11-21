<?php

declare(strict_types=1);

namespace App\Agents\Data;

use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Drivers\Enums\HookDriver;
use Spatie\LaravelData\Data;

/**
 * One combination a host can run, as journal-agent sends it.
 */
final class HostCombinationData extends Data
{
    public function __construct(
        public readonly HookDriver $driver,
        public readonly string $build,
        public readonly ArrangementType $arrangement,
        public readonly ExecutionModeType $placement,
        public readonly DriverVariant $variant,
    ) {}
}
