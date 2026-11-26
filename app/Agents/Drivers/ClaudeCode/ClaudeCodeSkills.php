<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\DefaultDrivers;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Enums\SkillReload;
use App\Values\SkillDelivery;
use App\Values\SkillKey;

/**
 * Claude Code 2.1.323 finds a session's skills in a plugin folder passed with --plugin-dir, the only route that works
 * with the journal's empty setting sources. The host writes that folder inside the start's isolated
 * settings folder; the driver lists its skills at start only.
 */
final readonly class ClaudeCodeSkills implements DriverSkills
{
    public const string PLUGIN_NAME = 'journal-session-skills';

    public const string FOLDER = 'journal-skills';

    public function skillProtocol(): string
    {
        return DefaultDrivers::CLAUDE_CODE;
    }

    public function skillFile(SkillKey $key): string
    {
        return "skills/{$key->key}/SKILL.md";
    }

    public function supportFiles(): array
    {
        $plugin = [
            'name' => self::PLUGIN_NAME,
            'version' => '1.0.0',
            'description' => 'The skills the journal selected for this session.',
        ];

        return ['.claude-plugin/plugin.json' => json_encode($plugin, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT)."\n"];
    }

    public function delivery(): SkillDelivery
    {
        return new SkillDelivery(self::FOLDER, ['--plugin-dir']);
    }

    public function reloadMode(): SkillReload
    {
        return SkillReload::NewSession;
    }
}
