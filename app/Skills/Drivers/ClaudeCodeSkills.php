<?php

declare(strict_types=1);

namespace App\Skills\Drivers;

use App\Skills\Contracts\DriverSkills;
use App\Skills\Enums\SkillReload;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillDelivery;
use App\Skills\Values\SkillKey;

/**
 * Claude Code 2.1.323 finds a session's skills in a plugin folder passed with --plugin-dir, the only route that works
 * with the journal's empty setting sources (report 171). The host writes that folder inside the start's isolated
 * settings folder; the driver lists its skills at start only.
 */
final readonly class ClaudeCodeSkills implements DriverSkills
{
    public const string PLUGIN_NAME = 'journal-session-skills';

    public const string FOLDER = 'journal-skills';

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

    /**
     * The journal denies Claude's Skill tool as a route to another agent; without it the model is not told about the
     * plugin's skills, so it is pointed at the file to read.
     */
    public function instruction(PublishedSkill $skill): string
    {
        return "Read the skill {$skill->key->key} with the Read tool at {$skill->path} before work it covers.";
    }

    public function reloadMode(): SkillReload
    {
        return SkillReload::NewSession;
    }
}
