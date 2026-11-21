<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Drivers\Enums\HookDriver;

/**
 * One capability a start would need, for a program, how its account signs in and where it runs.
 */
final readonly class HostCapabilityQuery
{
    public function __construct(
        public HostCapabilityType $capability,
        public HookDriver $driver,
        public AccountModeType $accountMode,
        public ExecutionModeType $executionMode,
    ) {}

    public function describe(): string
    {
        return sprintf(
            '%s for %s with a %s account in %s mode',
            $this->capability->value,
            $this->driver->value,
            $this->accountMode->value,
            $this->executionMode->value,
        );
    }
}
