<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Hooks\Enums\HookProgram;

/**
 * One combination a launch would need: a program, how its account signs in and where it runs.
 */
final readonly class HostCapabilityQuery
{
    public function __construct(
        public HookProgram $program,
        public AccountModeType $accountMode,
        public ExecutionModeType $executionMode,
    ) {}

    public function describe(): string
    {
        return "{$this->program->value} with a {$this->accountMode->value} account in {$this->executionMode->value} mode";
    }
}
