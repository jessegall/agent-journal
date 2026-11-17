<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

/**
 * The adapter of each supported program.
 */
final readonly class ProgramAdapters
{
    public function __construct(
        private ClaudeCodeAdapter $claudeCode,
        private CodexAdapter $codex,
    ) {}

    public function for(HookProgram $program): ProgramAdapter
    {
        return match ($program) {
            HookProgram::ClaudeCode => $this->claudeCode,
            HookProgram::Codex => $this->codex,
        };
    }
}
