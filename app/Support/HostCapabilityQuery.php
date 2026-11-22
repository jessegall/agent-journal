<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\AccountModeType;
use App\Enums\ExecutionModeType;
use App\Enums\HostCapabilityType;

/**
 * One capability a start would need, for a driver, how its account signs in and where it runs.
 */
final readonly class HostCapabilityQuery
{
    public function __construct(
        public HostCapabilityType $capability,
        public string $driver,
        public AccountModeType $accountMode,
        public ExecutionModeType $executionMode,
    ) {}

    public function describe(): string
    {
        return sprintf(
            '%s for %s with a %s account in %s mode',
            $this->capability->value,
            $this->driver,
            $this->accountMode->value,
            $this->executionMode->value,
        );
    }
}
