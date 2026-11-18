<?php

declare(strict_types=1);

namespace App\Skills\Programs;

use App\Programs\Enums\HookProgram;
use App\Skills\Contracts\ProgramSkills;
use App\Skills\Enums\SkillReload;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\LaunchSkillSet;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;
use App\Skills\Values\SkillKey;

/**
 * Codex 0.165.0 finds a session's skills in the skills folder of its isolated CODEX_HOME, which the launch links to the
 * session's target (report 171); never the legacy .codex/skills. It lists them when a turn's process starts.
 */
final readonly class CodexSkills implements ProgramSkills
{
    public const string SETTINGS_LINK = 'skills';

    public function __construct(
        private SkillTargets $targets,
    ) {}

    public function skillFile(SkillKey $key): string
    {
        return "{$key->key}/SKILL.md";
    }

    public function supportFiles(): array
    {
        return [];
    }

    public function delivery(LaunchSkillSet $skills): SkillDelivery
    {
        $target = $this->targets->targetFor($skills->sessionId, HookProgram::Codex->programKey());

        return new SkillDelivery($target, [], [self::SETTINGS_LINK => $target]);
    }

    public function instruction(PublishedSkill $skill): string
    {
        return "Read the skill {$skill->key->key} at {$skill->path} before work it covers.";
    }

    public function reloadMode(): SkillReload
    {
        return SkillReload::NewSession;
    }
}
