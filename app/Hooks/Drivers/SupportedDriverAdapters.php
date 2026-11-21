<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Contracts\DriverAdapter;
use App\Hooks\Contracts\DriverAdapters;

/**
 * The adapter of each supported program.
 */
final readonly class SupportedDriverAdapters implements DriverAdapters
{
    public function __construct(
        private ClaudeCodeAdapter $claudeCode,
        private CodexAdapter $codex,
    ) {}

    public function for(HookDriver $driver): DriverAdapter
    {
        return match ($driver) {
            HookDriver::ClaudeCode => $this->claudeCode,
            HookDriver::Codex => $this->codex,
        };
    }
}
