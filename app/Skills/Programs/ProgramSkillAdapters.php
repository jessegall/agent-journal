<?php

declare(strict_types=1);

namespace App\Skills\Programs;

use App\Programs\Enums\HookProgram;
use App\Programs\Values\ProgramKey;
use App\Skills\Contracts\ProgramSkills;
use App\Skills\Exceptions\ProgramSkillsUnsupported;

/**
 * The skill adapter of each program the journal can hand skills to.
 */
final readonly class ProgramSkillAdapters
{
    public function __construct(
        private ClaudeCodeSkills $claudeCode,
        private CodexSkills $codex,
    ) {}

    /**
     * @throws ProgramSkillsUnsupported for a program with no adapter
     */
    public function for(ProgramKey $program): ProgramSkills
    {
        return match (HookProgram::tryFrom($program->key)) {
            HookProgram::ClaudeCode => $this->claudeCode,
            HookProgram::Codex => $this->codex,
            null => throw ProgramSkillsUnsupported::for($program),
        };
    }

    public function supports(ProgramKey $program): bool
    {
        return HookProgram::tryFrom($program->key) !== null;
    }
}
