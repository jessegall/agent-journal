<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Hooks\Enums\ToolOutcome;
use App\Skills\Enums\ReadEvidence;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use App\Values\ProvenSkillRead;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Only a call that returns a whole skill proves a read: the Skill tool, or a whole Read or cat of a delivered SKILL.md.
 * A listing, a partial read and a failed call prove nothing.
 */
final class ProvenSkillReadTest extends TestCase
{
    private const string FILE = '/host/runtimes/01jd8x0g9m3qz6v4k2t7r5w1ce/journal-skills/skills/journal-plans/SKILL.md';

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
    }

    /**
     * @return iterable<string, array{ToolResult}>
     */
    public static function nonProofs(): iterable
    {
        yield 'a listing' => [self::call('Bash', ['command' => 'ls '.dirname(self::FILE, 2)])];

        yield 'a partial read' => [self::call('Read', ['file_path' => self::FILE, 'limit' => 10])];

        yield 'another file' => [self::call('Read', ['file_path' => '/work/README.md'])];

        yield 'a failed read' => [
            new ToolResult('Read', ToolOutcome::Failed, new DriverToolInput(['file_path' => self::FILE])),
        ];
    }

    #[DataProvider('proofs')]
    public function test_a_whole_read_proves_the_skill_with_its_evidence(ToolResult $call, ReadEvidence $evidence): void
    {
        $read = ProvenSkillRead::of($call);

        $this->assertNotNull($read);
        $this->assertSame('journal-plans', $read->skillKey);
        $this->assertSame($evidence, $read->evidence);
    }

    #[DataProvider('nonProofs')]
    public function test_anything_else_proves_nothing(ToolResult $call): void
    {
        $this->assertNull(ProvenSkillRead::of($call));
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private static function call(string $tool, array $arguments): ToolResult
    {
        return new ToolResult($tool, ToolOutcome::Succeeded, new DriverToolInput($arguments));
    }
}
