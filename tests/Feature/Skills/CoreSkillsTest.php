<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

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
            ['journal', 'journal-access', 'journal-profiles', 'journal-skills', 'journal-shell'],
            array_column($core, 'key'),
        );
        $this->assertSame(array_fill(0, 5, 'shipped'), array_column($core, 'source'));
    }
}
