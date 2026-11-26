<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\DefaultDrivers;
use App\Contracts\Skills\DriverSkills;
use App\Enums\Skills\SkillReload;
use App\Values\SkillDelivery;
use App\Values\SkillKey;

/**
 * Codex 0.165.0 finds a session's skills in the skills folder of its isolated CODEX_HOME, which is the start's
 * settings folder, so the host writes them there and adds no argument; never the legacy .codex/skills.
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

    public function reloadMode(): SkillReload
    {
        return SkillReload::NewSession;
    }
}
