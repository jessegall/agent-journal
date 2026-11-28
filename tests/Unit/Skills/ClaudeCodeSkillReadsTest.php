<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Hooks\Enums\ToolOutcome;
use App\Skills\Enums\ReadEvidence;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Claude Code proves a skill read with its Skill tool loading one of the session's skills, a whole Read of a
 * delivered SKILL.md, or a Bash cat or skill:show of one; a listing, a partial read, another file or another plugin's
 * skill proves nothing.
 */
final class ClaudeCodeSkillReadsTest extends TestCase
{
    private const string RUNTIME = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private const string FILE = '/host/runtimes/'.self::RUNTIME.'/journal-skills/skills/journal-plans/SKILL.md';

    /**
     * @return iterable<string, array{ToolResult, ReadEvidence}>
     */
    public static function proofs(): iterable
    {
        yield 'skill tool' => [
            self::call('Skill', ['skill' => 'journal-session-skills:journal-plans']),
            ReadEvidence::ClaudeSkillTool,
        ];

        yield 'whole read' => [self::call('Read', ['file_path' => self::FILE]), ReadEvidence::FullFileRead];

        yield 'shell cat' => [self::call('Bash', ['command' => 'cat '.self::FILE]), ReadEvidence::FullFileRead];

        yield 'skill show' => [
            self::call('Bash', ['command' => 'php artisan skill:show journal-plans']),
            ReadEvidence::SkillShow,
        ];
    }

    /**
     * @return iterable<string, array{ToolResult}>
     */
    public static function nonProofs(): iterable
    {
        yield 'a listing' => [self::call('Bash', ['command' => 'ls '.dirname(self::FILE, 2)])];

        yield 'a partial read' => [self::call('Read', ['file_path' => self::FILE, 'limit' => 10])];

        yield 'another file' => [self::call('Read', ['file_path' => '/work/README.md'])];

        yield 'another runtimes file' => [
            self::call('Read', ['file_path' => '/host/runtimes/other-runtime/skills/journal-plans/SKILL.md']),
        ];

        yield 'a dotted path' => [
            self::call('Read', ['file_path' => '/host/runtimes/'.self::RUNTIME.'/../x/skills/journal-plans/SKILL.md']),
        ];

        yield 'head of the file' => [self::call('Bash', ['command' => 'head -5 '.self::FILE])];

        yield 'sed of the file' => [self::call('Bash', ['command' => "sed -n '1,\$p' ".self::FILE])];

        yield 'skill show with more after it' => [
            self::call('Bash', ['command' => 'php artisan skill:show journal-plans && ls']),
        ];

        yield 'another plugin skill' => [self::call('Skill', ['skill' => 'other-plugin:journal-plans'])];
    }

    #[DataProvider('proofs')]
    public function test_a_whole_read_proves_the_skill_with_its_evidence(ToolResult $call, ReadEvidence $evidence): void
    {
        $read = new ClaudeCodeSkills()->provenRead($call, self::RUNTIME);

        $this->assertSame(['journal-plans', $evidence], [$read?->skillKey, $read?->evidence]);
    }

    #[DataProvider('nonProofs')]
    public function test_anything_else_proves_nothing(ToolResult $call): void
    {
        $this->assertNull(new ClaudeCodeSkills()->provenRead($call, self::RUNTIME));
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private static function call(string $tool, array $arguments): ToolResult
    {
        return new ToolResult($tool, ToolOutcome::Succeeded, new DriverToolInput($arguments));
    }
}
