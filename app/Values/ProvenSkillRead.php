<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Hooks\Enums\ToolOutcome;
use App\Skills\Enums\ReadEvidence;
use App\Support\Inputs\Values\ToolResult;

/**
 * A finished tool call that proves an agent read one skill whole: Claude's Skill tool, a Read of a whole SKILL.md of
 * the session's own runtime folder, a shell cat of one, or a successful php artisan skill:show of the key. A listing,
 * a partial read, a file of another folder or anything else proves nothing.
 */
final readonly class ProvenSkillRead
{
    private const string KEY = '[a-z0-9]+(?:-[a-z0-9]+)*';

    private const string SHELL_READ = '~^cat\s+([\'"]?)(\S+)\1\s*$~';

    private const string SKILL_SHOW = '~^php\s+artisan\s+skill:show\s+('.self::KEY.')\s*$~';

    private const string DOTTED_SEGMENT = '~(?:^|/)\.\.?(?:/|$)~';

    private function __construct(
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}

    /**
     * The read the call proves for the session whose runtime has this id, or null when it proves none.
     */
    public static function of(ToolResult $call, string $runtimeId): self|null
    {
        if ($call->outcome !== ToolOutcome::Succeeded) {
            return null;
        }

        return self::skillTool($call) ?? self::fileRead($call, $runtimeId) ?? self::shellRead($call, $runtimeId);
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

    private static function fileRead(ToolResult $call, string $runtimeId): self|null
    {
        $partial = $call->arguments->hasArgument('offset') || $call->arguments->hasArgument('limit');
        $path = $call->toolName === 'Read' && ! $partial ? $call->arguments->textArgument('file_path') : null;

        if ($path !== null) {
            return self::fromPath($path, $runtimeId);
        }

        return null;
    }

    private static function shellRead(ToolResult $call, string $runtimeId): self|null
    {
        $command = trim((string) $call->arguments->textArgument('command'));

        if (preg_match(self::SKILL_SHOW, $command, $match) === 1) {
            return new self($match[1], ReadEvidence::SkillShow);
        }

        if (preg_match(self::SHELL_READ, $command, $match) === 1) {
            return self::fromPath($match[2], $runtimeId);
        }

        return null;
    }

    /**
     * The skill a path names when it is a SKILL.md inside the folder of this runtime, written without dotted segments.
     */
    private static function fromPath(string $path, string $runtimeId): self|null
    {
        if (preg_match(self::DOTTED_SEGMENT, $path) === 1) {
            return null;
        }

        $skillFile = '~(?:^|/)runtimes/'.preg_quote($runtimeId, '~').'/(?:[^/]+/)*skills/('.self::KEY.')/SKILL\.md$~';

        if (preg_match($skillFile, $path, $match) === 1) {
            return new self($match[1], ReadEvidence::FullFileRead);
        }

        return null;
    }
}
