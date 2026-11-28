<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\ClaudeCode\Enums\ClaudeCodeTool;
use App\Agents\Drivers\DefaultDrivers;
use App\Skills\Contracts\DriverSkills;
use App\Skills\Enums\SkillReload;
use App\Support\Inputs\Values\ToolResult;
use App\Values\ProvenSkillRead;
use App\Values\SkillDelivery;
use App\Values\SkillKey;

/**
 * Claude Code 2.1.323 finds a session's skills in a plugin folder passed with --plugin-dir, the only route that works
 * with the journal's empty setting sources. The host writes that folder inside the start's isolated
 * settings folder; the driver lists its skills at start only. Its Skill tool loading one of them, a Read of a whole
 * SKILL.md, and a Bash cat or skill:show prove a skill read.
 */
final readonly class ClaudeCodeSkills implements DriverSkills
{
    public const string PLUGIN_NAME = 'journal-session-skills';

    public const string FOLDER = 'journal-skills';

    /**
     * The tool Claude Code loads a skill of a plugin with, named plugin:skill.
     */
    private const string SKILL_TOOL = 'Skill';

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

    public function provenRead(ToolResult $call, string $runtimeId): ProvenSkillRead|null
    {
        if ($call->toolName === self::SKILL_TOOL) {
            return $this->skillToolRead($call);
        }

        if ($call->toolName === ClaudeCodeTool::Read->value) {
            return $this->wholeFileRead($call, $runtimeId);
        }

        if ($call->toolName === ClaudeCodeTool::Bash->value) {
            $line = (string) $call->arguments->textArgument('command');

            return ProvenSkillRead::byShellLine($line, [ProvenSkillRead::WHOLE_CAT], $runtimeId);
        }

        return null;
    }

    private function skillToolRead(ToolResult $call): ProvenSkillRead|null
    {
        $prefix = self::PLUGIN_NAME.':';
        $skill = $call->arguments->textArgument('skill');

        if ($skill !== null && str_starts_with($skill, $prefix)) {
            return ProvenSkillRead::bySkillTool(substr($skill, strlen($prefix)));
        }

        return null;
    }

    private function wholeFileRead(ToolResult $call, string $runtimeId): ProvenSkillRead|null
    {
        $path = $call->arguments->textArgument('file_path');
        $isPartial = $call->arguments->hasArgument('offset') || $call->arguments->hasArgument('limit');

        if ($path === null || $isPartial) {
            return null;
        }

        return ProvenSkillRead::inFile($path, $runtimeId);
    }
}
