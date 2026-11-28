<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Agents\Drivers\Codex\CodexSkills;
use App\Hooks\Enums\ToolOutcome;
use App\Skills\Enums\ReadEvidence;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Codex has no skill tool and reads files through its shell, so its shell cat or sed -n of a whole delivered SKILL.md,
 * or skill:show, proves a skill read; sed -n of a range of lines, head, a Claude Code tool name or another file proves
 * nothing.
 */
final class CodexSkillReadsTest extends TestCase
{
    private const string RUNTIME = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private const string FILE = '/host/runtimes/'.self::RUNTIME.'/skills/journal-plans/SKILL.md';

    /**
     * @return iterable<string, array{ToolResult, ReadEvidence}>
     */
    public static function proofs(): iterable
    {
        yield 'a quoted cat' => [self::shell('cat "'.self::FILE.'"'), ReadEvidence::FullFileRead];

        yield 'a whole sed' => [self::shell("sed -n '1,\$p' ".self::FILE), ReadEvidence::FullFileRead];

        yield 'a sed that prints every line' => [self::shell('sed -n p '.self::FILE), ReadEvidence::FullFileRead];

        yield 'skill show' => [self::shell('php artisan skill:show journal-plans'), ReadEvidence::SkillShow];
    }

    /**
     * @return iterable<string, array{ToolResult}>
     */
    public static function nonProofs(): iterable
    {
        yield 'a sed of a range' => [self::shell("sed -n '1,200p' ".self::FILE)];

        yield 'head of the file' => [self::shell('head -n 40 '.self::FILE)];

        yield 'a listing' => [self::shell('ls '.dirname(self::FILE, 2))];

        yield 'another runtimes file' => [
            self::shell('cat /host/runtimes/other-runtime/skills/journal-plans/SKILL.md'),
        ];

        yield 'a Claude Code skill tool' => [
            new ToolResult(
                'Skill',
                ToolOutcome::Succeeded,
                new DriverToolInput(['skill' => 'journal-session-skills:journal-plans']),
            ),
        ];

        yield 'a Claude Code read' => [
            new ToolResult('Read', ToolOutcome::Succeeded, new DriverToolInput(['file_path' => self::FILE])),
        ];
    }

    #[DataProvider('proofs')]
    public function test_a_whole_shell_read_proves_the_skill(ToolResult $call, ReadEvidence $evidence): void
    {
        $read = new CodexSkills()->provenRead($call, self::RUNTIME);

        $this->assertSame(['journal-plans', $evidence], [$read?->skillKey, $read?->evidence]);
    }

    #[DataProvider('nonProofs')]
    public function test_anything_else_proves_nothing(ToolResult $call): void
    {
        $this->assertNull(new CodexSkills()->provenRead($call, self::RUNTIME));
    }

    private static function shell(string $command): ToolResult
    {
        return new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => $command]));
    }
}
