<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Hooks\ToolOutcome;
use App\Enums\Skills\ReadEvidence;
use App\Support\Drivers\ClaudeCodeSkills;
use App\Support\Inputs\Values\ToolResult;

/**
 * A finished tool call that proves an agent read one skill whole: Claude's Skill tool, a Read of a whole delivered
 * SKILL.md or a shell cat of one. A listing, a partial read or anything else proves nothing.
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

        return self::skillTool($call) ?? self::fileRead($call) ?? self::shellRead($call);
    }

    private static function skillTool(ToolResult $call): self|null
    {
        $prefix = ClaudeCodeSkills::PLUGIN_NAME.':';
        $skill = $call->toolName === 'Skill' ? $call->arguments->textArgument('skill') : null;

        if ($skill !== null && str_starts_with($skill, $prefix)) {
            return new self(substr($skill, strlen($prefix)), ReadEvidence::ClaudeSkillTool);
        }

        return null;
    }

    private static function fileRead(ToolResult $call): self|null
    {
        $partial = $call->arguments->hasArgument('offset') || $call->arguments->hasArgument('limit');
        $path = $call->toolName === 'Read' && ! $partial ? $call->arguments->textArgument('file_path') : null;

        if ($path !== null) {
            return self::fromPath($path, ReadEvidence::FullFileRead);
        }

        return null;
    }

    private static function shellRead(ToolResult $call): self|null
    {
        $command = trim((string) $call->arguments->textArgument('command'));

        if (preg_match(self::SHELL_READ, $command, $match) === 1) {
            return self::fromPath($match[2], ReadEvidence::FullFileRead);
        }

        return null;
    }

    private static function fromPath(string $path, ReadEvidence $evidence): self|null
    {
        if (preg_match(self::SKILL_FILE, $path, $match) === 1) {
            return new self($match[1], $evidence);
        }

        return null;
    }
}
