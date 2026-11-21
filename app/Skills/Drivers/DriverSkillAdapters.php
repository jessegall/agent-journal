<?php

declare(strict_types=1);

namespace App\Skills\Drivers;

use App\Drivers\Enums\HookDriver;
use App\Drivers\Values\DriverKey;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Exceptions\DriverSkillsUnsupported;
use App\Skills\Drivers\ClaudeCodeSkills;
use App\Skills\Drivers\CodexSkills;

/**
 * The skill adapter of each program the journal can hand skills to.
 */
final readonly class DriverSkillAdapters
{
    public function __construct(
        private ClaudeCodeSkills $claudeCode,
        private CodexSkills $codex,
    ) {}

    /**
     * @throws DriverSkillsUnsupported for a program with no adapter
     */
    public function for(DriverKey $driver): DriverSkills
    {
        return match (HookDriver::tryFrom($driver->key)) {
            HookDriver::ClaudeCode => $this->claudeCode,
            HookDriver::Codex => $this->codex,
            null => throw DriverSkillsUnsupported::for($driver),
        };
    }

    public function supports(DriverKey $driver): bool
    {
        return HookDriver::tryFrom($driver->key) !== null;
    }
}
