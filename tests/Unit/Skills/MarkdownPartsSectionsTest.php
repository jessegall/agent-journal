<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Skills\Exceptions\SkillSourceInvalid;
use App\Skills\Support\MarkdownParts;
use App\Skills\Values\SkillOwner;
use App\Skills\Values\SkillSection;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * A skill file becomes sections: its text under the # title is the purpose, each ## heading is one section, and a
 * broken file is refused naming the file and the heading.
 */
final class MarkdownPartsSectionsTest extends TestCase
{
    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root.'/resources/skills', recursive: true);
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_the_text_under_the_title_is_the_purpose_and_each_heading_is_a_section_in_file_order(): void
    {
        $this->write("# Shell\n\nCommands run through the journal.\n\nThey keep their output.\n\n## Running commands\n\nRun.\n\n## Reading output\n\nRead.\n");

        $sections = $this->sections('Shell');

        $this->assertSame(['purpose', 'running-commands', 'reading-output'], array_map(fn (SkillSection $section) => $section->key, $sections));
        $this->assertSame(['Purpose', 'Running commands', 'Reading output'], array_map(fn (SkillSection $section) => $section->heading, $sections));
        $this->assertSame("Commands run through the journal.\n\nThey keep their output.", $sections[0]->content);
        $this->assertSame('Run.', $sections[1]->body(new MarkdownParts(), $this->owner()));
        $this->assertSame('Read.', $sections[2]->body(new MarkdownParts(), $this->owner()));
    }

    public function test_no_text_under_the_title_gives_no_purpose_section(): void
    {
        $this->write("# Shell\n\n## Running commands\n\nRun.\n");

        $this->assertSame(['running-commands'], array_map(fn (SkillSection $section) => $section->key, $this->sections('Shell')));
    }

    public function test_a_title_with_no_heading_and_no_purpose_gives_no_sections(): void
    {
        $this->write("# Shell\n");

        $this->assertSame([], $this->sections('Shell'));
    }

    public function test_a_subheading_stays_in_its_section_and_a_fenced_heading_is_no_section(): void
    {
        $this->write("# Shell\n\n## Failure\n\n### Retry\n\nAgain.\n\n```markdown\n## Not a heading\n```\n\n## Done\n");

        $sections = $this->sections('Shell');

        $this->assertSame(['failure', 'done'], array_map(fn (SkillSection $section) => $section->key, $sections));
        $this->assertStringContainsString("### Retry\n\nAgain.", $sections[0]->body(new MarkdownParts(), $this->owner()));
        $this->assertStringContainsString('## Not a heading', $sections[0]->body(new MarkdownParts(), $this->owner()));
        $this->assertSame('', $sections[1]->body(new MarkdownParts(), $this->owner()));
    }

    public function test_front_matter_and_line_endings_do_not_change_the_sections(): void
    {
        $this->write("# Shell\n\nPurpose.\n\n## One\n\nText.\n");
        $plain = $this->sections('Shell');

        $this->write("---\nname: shell\n---\r\n# Shell\r\n\r\nPurpose.\r\n\r\n## One\r\n\r\nText.\r\n");
        $other = $this->sections('Shell');

        $this->assertEquals($plain, $other);
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function headingsAndKeys(): iterable
    {
        yield 'comma' => ['Starting, blocking and finishing', 'starting-blocking-and-finishing'];
        yield 'code and dashes' => ['Use `--permit` safely', 'use-permit-safely'];
        yield 'accent' => ['Café rules', 'cafe-rules'];
        yield 'plan' => ['Holding plan work', 'holding-plan-work'];
    }

    #[DataProvider('headingsAndKeys')]
    public function test_a_heading_gives_a_kebab_case_key_and_keeps_its_title(string $heading, string $key): void
    {
        $this->write("# Shell\n\n## {$heading}\n\nText.\n");

        $section = $this->sections('Shell')[0];

        $this->assertSame($key, $section->key);
        $this->assertSame($heading, $section->heading);
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function brokenFiles(): iterable
    {
        yield 'no title' => ["## States\n\nText.\n", 'has no # title before its first ## heading'];
        yield 'text before the title' => ["Intro.\n\n# Shell\n\n## States\n", 'has no # title before its first ## heading'];
        yield 'a deeper heading first' => ["### States\n\n# Shell\n\n## One\n", 'has no # title before its first ## heading'];
        yield 'no heading at all' => ["Just text.\n", 'has no # title before its first ## heading'];
        yield 'second title' => ["# Shell\n\n## States\n\n# Notes\n", 'has a second # title, Notes'];
        yield 'title differs' => ["# Shells\n\n## States\n", 'has the # title Shells, but the skill is named Shell'];
        yield 'heading without key' => ["# Shell\n\n## ???\n", 'has the ## heading ???, which gives no section key'];
    }

    #[DataProvider('brokenFiles')]
    public function test_a_broken_file_is_refused_naming_the_file_and_the_heading(string $markdown, string $message): void
    {
        $this->write($markdown);

        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage('The skill source shell.md '.$message);
        $this->sections('Shell');
    }

    public function test_a_missing_file_is_refused(): void
    {
        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage('nope.md does not exist');

        (new MarkdownParts())->sectionsOf('nope.md', $this->owner(), 'Shell');
    }

    public function test_a_file_outside_the_folder_is_refused(): void
    {
        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage('is not a relative path inside');

        (new MarkdownParts())->sectionsOf('../secrets.md', $this->owner(), 'Shell');
    }

    public function test_a_file_that_is_not_text_is_refused_as_unreadable(): void
    {
        File::put($this->root.'/resources/skills/shell.md', "# Shell\n\xB1\xB2\n");

        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage('cannot be read');

        $this->sections('Shell');
    }

    private function write(string $markdown): void
    {
        File::put($this->root.'/resources/skills/shell.md', $markdown);
    }

    /**
     * @return list<SkillSection>
     */
    private function sections(string $name): array
    {
        return (new MarkdownParts())->sectionsOf('shell.md', $this->owner(), $name);
    }

    private function owner(): SkillOwner
    {
        return new SkillOwner('Shell', $this->root, [], true);
    }
}
