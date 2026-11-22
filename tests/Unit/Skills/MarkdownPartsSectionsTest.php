<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Exceptions\SkillSourceInvalid;
use App\Support\MarkdownParts;
use App\Values\SkillOwner;
use App\Values\SkillSection;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;

/**
 * A skill file becomes sections: its text under the # title is the purpose, each ## heading is one section, and a
 * broken file is refused naming the file and the heading.
 */
final class MarkdownPartsSectionsTest extends TestCase
{
    use UsesTemporaryFolder;

    private const string PURPOSE_TEXT = <<<'TEXT'
        Commands run through the journal.

        They keep their output.
        TEXT;

    private const string RETRY_TEXT = <<<'TEXT'
        ### Retry

        Again.
        TEXT;

    private const string FENCED_HEADING = '## Not a heading';

    private const string UNREADABLE = 'cannot be read';

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('skills');
        File::makeDirectory($this->root.'/resources/skills', recursive: true);
    }

    public function test_the_text_under_the_title_is_the_purpose_and_each_heading_is_a_section_in_file_order(): void
    {
        $this->write(<<<'TEXT'
        # Shell

        Commands run through the journal.

        They keep their output.

        ## Running 
        TEXT
            .<<<'TEXT'
            commands

            Run.

            ## Reading output

            Read.

            TEXT);

        $sections = $this->sections('Shell');

        $this->assertSame(
            ['purpose', 'running-commands', 'reading-output'],
            array_map(fn (SkillSection $section) => $section->key, $sections),
        );
        $this->assertSame(
            ['Purpose', 'Running commands', 'Reading output'],
            array_map(fn (SkillSection $section) => $section->heading, $sections),
        );
        $this->assertSame(self::PURPOSE_TEXT, $sections[0]->content);
        $this->assertSame('Run.', $sections[1]->body($this->app->make(MarkdownParts::class), $this->owner()));
        $this->assertSame('Read.', $sections[2]->body($this->app->make(MarkdownParts::class), $this->owner()));
    }

    public function test_no_text_under_the_title_gives_no_purpose_section(): void
    {
        $this->write(<<<'TEXT'
        # Shell

        ## Running commands

        Run.

        TEXT);

        $this->assertSame(
            ['running-commands'],
            array_map(fn (SkillSection $section) => $section->key, $this->sections('Shell')),
        );
    }

    public function test_a_title_with_no_heading_and_no_purpose_gives_no_sections(): void
    {
        $this->write("# Shell\n");

        $this->assertSame([], $this->sections('Shell'));
    }

    public function test_a_subheading_stays_in_its_section_and_a_fenced_heading_is_no_section(): void
    {
        $this->write(<<<'TEXT'
        # Shell

        ## Failure

        ### Retry

        Again.

        ```markdown
        ## Not a heading
        ```

        ## Done

        TEXT);

        $sections = $this->sections('Shell');

        $this->assertSame(['failure', 'done'], array_map(fn (SkillSection $section) => $section->key, $sections));
        $this->assertStringContainsString(
            self::RETRY_TEXT,
            $sections[0]->body($this->app->make(MarkdownParts::class), $this->owner()),
        );
        $fenced = $sections[0]->body($this->app->make(MarkdownParts::class), $this->owner());

        $this->assertStringContainsString(self::FENCED_HEADING, $fenced);
        $this->assertSame('', $sections[1]->body($this->app->make(MarkdownParts::class), $this->owner()));
    }

    public function test_front_matter_and_line_endings_do_not_change_the_sections(): void
    {
        $this->write(<<<'TEXT'
        # Shell

        Purpose.

        ## One

        Text.

        TEXT);
        $plain = $this->sections('Shell');

        $this->write(<<<TEXT
        ---
        name: shell
        ---\r
        # Shell\r
        \r
        Purpose.\r
        \r
        ## One\r
        \r
        Text.\r

        TEXT);
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
        $this->write(<<<TEXT
        # Shell

        ## {$heading}

        Text.

        TEXT);

        $section = $this->sections('Shell')[0];

        $this->assertSame($key, $section->key);
        $this->assertSame($heading, $section->heading);
    }

    /**
     * @return iterable<string, array{string, SkillSourceInvalid}>
     */
    public static function brokenFiles(): iterable
    {
        yield 'no title' => [<<<'TEXT'
        ## States

        Text.

        TEXT, SkillSourceInvalid::missingTitle('shell.md')];

        yield 'text before the title' => [
            <<<'TEXT'
            Intro.

            # Shell

            ## States

            TEXT,
            SkillSourceInvalid::missingTitle('shell.md'),
        ];

        yield 'a deeper heading first' => [
            <<<'TEXT'
            ### States

            # Shell

            ## One

            TEXT,
            SkillSourceInvalid::missingTitle('shell.md'),
        ];

        yield 'no heading at all' => ["Just text.\n", SkillSourceInvalid::missingTitle('shell.md')];

        yield 'second title' => [<<<'TEXT'
        # Shell

        ## States

        # Notes

        TEXT, SkillSourceInvalid::secondTitle('shell.md', 'Notes')];

        yield 'title differs' => [<<<'TEXT'
        # Shells

        ## States

        TEXT, SkillSourceInvalid::titleDiffers('shell.md', 'Shells', 'Shell')];

        yield 'heading without key' => [<<<'TEXT'
        # Shell

        ## ???

        TEXT, SkillSourceInvalid::headingWithoutKey('shell.md', '???')];
    }

    #[DataProvider('brokenFiles')]
    public function test_a_broken_file_is_refused_naming_the_file_and_the_heading(
        string $markdown,
        SkillSourceInvalid $refusal,
    ): void {
        $this->write($markdown);

        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage($refusal->getMessage());
        $this->sections('Shell');
    }

    /**
     * @return iterable<string, array{string, string}>
     */
    public static function unreachablePaths(): iterable
    {
        yield 'a missing file' => ['nope.md', 'nope.md does not exist'];

        yield 'a file outside the folder' => ['../secrets.md', 'is not a relative path inside'];
    }

    #[DataProvider('unreachablePaths')]
    public function test_a_path_to_no_file_inside_the_folder_is_refused(string $path, string $message): void
    {
        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage($message);

        $this->app->make(MarkdownParts::class)->sectionsOf($path, $this->owner(), 'Shell');
    }

    public function test_a_link_in_the_skills_folder_to_a_host_file_is_refused_and_the_file_never_read(): void
    {
        symlink('/etc/hosts', $this->root.'/resources/skills/hosts.md');

        $this->expectExceptionObject(SkillSourceInvalid::outsideFolder('hosts.md'));

        $this->app->make(MarkdownParts::class)->sectionsOf('hosts.md', $this->owner(), 'Shell');
    }

    public function test_a_file_that_is_not_text_is_refused_as_unreadable(): void
    {
        File::put($this->root.'/resources/skills/shell.md', <<<TEXT
        # Shell
        \xB1\xB2

        TEXT);

        $this->expectException(SkillSourceInvalid::class);
        $this->expectExceptionMessage(self::UNREADABLE);

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
        return $this->app->make(MarkdownParts::class)->sectionsOf('shell.md', $this->owner(), $name);
    }

    private function owner(): SkillOwner
    {
        return new SkillOwner('Shell', $this->root, [], true);
    }
}
