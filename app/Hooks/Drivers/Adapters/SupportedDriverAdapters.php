<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Adapters;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Drivers\Contracts\DriverAdapters;
use App\Hooks\Drivers\Contracts\DriverAdapter;
use App\Hooks\Drivers\Adapters\ClaudeCodeAdapter;
use App\Hooks\Drivers\Adapters\CodexAdapter;

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
