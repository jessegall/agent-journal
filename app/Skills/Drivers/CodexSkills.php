<?php

declare(strict_types=1);

namespace App\Skills\Drivers;

use App\Drivers\Support\DefaultDrivers;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Enums\SkillReload;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;
use App\Skills\Values\SkillKey;

/**
 * Codex 0.165.0 finds a session's skills in the skills folder of its isolated CODEX_HOME, which is the start's
 * settings folder, so the host writes them there and adds no argument (report 171); never the legacy .codex/skills.
 * It lists them when a turn's process starts.
 */
final readonly class CodexSkills implements DriverSkills
{
    public const string FOLDER = 'skills';

    public function skillProtocol(): string
    {
        return DefaultDrivers::CODEX;
    }

    public function skillFile(SkillKey $key): string
    {
        return "{$key->key}/SKILL.md";
    }

    public function supportFiles(): array
    {
        return [];
    }

    public function delivery(): SkillDelivery
    {
        return new SkillDelivery(self::FOLDER, []);
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
