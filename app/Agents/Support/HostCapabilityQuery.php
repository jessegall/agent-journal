<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Programs\Enums\HookProgram;

/**
 * One capability a launch would need, for a program, how its account signs in and where it runs.
 */
final readonly class HostCapabilityQuery
{
    public function __construct(
        public HostCapabilityType $capability,
        public HookProgram $program,
        public AccountModeType $accountMode,
        public ExecutionModeType $executionMode,
    ) {}

    public function describe(): string
    {
        return "{$this->capability->value} for {$this->program->value} with a {$this->accountMode->value} account in {$this->executionMode->value} mode";
    }
}
