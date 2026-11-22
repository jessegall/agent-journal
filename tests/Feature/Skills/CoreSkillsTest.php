<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\SkillResolver;
use App\Values\SkillKey;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Core ships the journal, journal-profiles, journal-skills and journal-shell skills, written in resources/skills/core.
 */
final class CoreSkillsTest extends TestCase
{
    use RefreshHookDatabase;

    private const string PURPOSE_SECTION = <<<'TEXT'
            ## Purpose

            Commands run through the journal, which keeps their output.

            TEXT;

    private const string TESTS_SECTION = <<<'TEXT'
            ## Tests and checks

            A test, check or build runs only when its rule has an approved, proven reader.
            TEXT;

    private const string READING_SECTION = <<<'TEXT'
        ## Reading skills

        - `skill:list` lists every skill
        TEXT;

    private const string SECOND_TITLE_ADVICE = 'a second `#` title, a title that differs from the skill\'s name';

    public function test_the_core_skills_are_listed_with_owner_core(): void
    {
        Artisan::call('skill:list', ['--json' => true]);
        $listed = json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR);
        $core = array_values(array_filter($listed, fn (array $skill) => $skill['owner'] === 'Core'));

        $this->assertSame(
            ['journal', 'journal-profiles', 'journal-skills', 'journal-shell'],
            array_column($core, 'key'),
        );
        $this->assertSame(['shipped', 'shipped', 'shipped', 'shipped'], array_column($core, 'source'));
    }

    public function test_the_shell_skill_publishes_every_heading_of_its_file_in_the_file_order(): void
    {
        $rendered = $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-shell'))->rendered->markdown;

        preg_match_all('/^## (.+)$/m', $rendered, $headings);

        $this->assertSame(
            ['Purpose', 'Running commands', 'Tests and checks', 'Reading output', 'Understanding a command line'],
            $headings[1],
        );
        $this->assertStringContainsString(
            self::PURPOSE_SECTION,
            $rendered,
        );
        $this->assertStringContainsString(
            self::TESTS_SECTION,
            $rendered,
        );
    }

    public function test_show_prints_the_rendered_journal_skills_text(): void
    {
        $rendered = $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-skills'))->rendered->markdown;

        Artisan::call('skill:show', ['key' => 'journal-skills']);

        $this->assertSame($rendered, Artisan::output());
        $this->assertStringContainsString(self::READING_SECTION, $rendered);
        $this->assertStringContainsString(self::SECOND_TITLE_ADVICE, $rendered);
    }
}
