<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ReadEvidence;
use App\Enums\ToolOutcome;
use App\Support\Drivers\ClaudeCodeSkills;
use App\Support\Inputs\Values\ToolResult;

/**
 * A finished tool call that proves an agent read one skill whole: Claude's Skill tool, a Read of a whole delivered
 * SKILL.md, a shell cat of one, or the journal's skills_show tool. A listing, a partial read or anything else proves
 * nothing.
 */
final readonly class ProvenSkillRead
{
    private const string SKILL_FILE = '~/skills/([a-z0-9]+(?:-[a-z0-9]+)*)/SKILL\.md$~';

    private const string SHELL_READ = '~^cat\s+([\'"]?)(\S+)\1\s*$~';

    private function __construct(
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}

    /**
     * The read the call proves, or null when it proves none.
     */
    public static function of(ToolResult $call): self|null
    {
        if ($call->outcome !== ToolOutcome::Succeeded) {
            return null;
        }

        return self::skillTool($call) ?? self::fileRead($call) ?? self::shellRead($call) ?? self::journalShow($call);
    }

    private static function skillTool(ToolResult $call): self|null
    {
        $prefix = ClaudeCodeSkills::PLUGIN_NAME.':';
        $skill = $call->toolName === 'Skill' ? $call->arguments->textArgument('skill') : null;

        return $skill !== null && str_starts_with($skill, $prefix)
            ? new self(substr($skill, strlen($prefix)), ReadEvidence::ClaudeSkillTool)
            : null;
    }

    private static function fileRead(ToolResult $call): self|null
    {
        $partial = $call->arguments->hasArgument('offset') || $call->arguments->hasArgument('limit');
        $path = $call->toolName === 'Read' && ! $partial ? $call->arguments->textArgument('file_path') : null;

        return $path !== null ? self::fromPath($path, ReadEvidence::FullFileRead) : null;
    }

    private static function shellRead(ToolResult $call): self|null
    {
        $command = trim((string) $call->arguments->textArgument('command'));

        return preg_match(self::SHELL_READ, $command, $match) === 1
            ? self::fromPath($match[2], ReadEvidence::FullFileRead)
            : null;
    }

    private static function journalShow(ToolResult $call): self|null
    {
        $key = str_ends_with($call->toolName, 'skills_show') ? $call->arguments->textArgument('key') : null;

        return $key !== null ? new self($key, ReadEvidence::JournalShow) : null;
    }

    private static function fromPath(string $path, ReadEvidence $evidence): self|null
    {
        return preg_match(self::SKILL_FILE, $path, $match) === 1 ? new self($match[1], $evidence) : null;
    }
}
