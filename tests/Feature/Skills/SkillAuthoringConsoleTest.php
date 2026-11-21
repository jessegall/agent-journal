<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Assignments\Policies\AssignmentRecipientPolicy;
use App\Skills\Models\Skill;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The section 8 user flow from the command line: make, edit against the revision read, preview, restore; a stale edit
 * prints the conflict with the latest revision, and a save never claims an agent loaded it.
 */
final class SkillAuthoringConsoleTest extends TestCase
{
    use CommitsHookRows;

    private const string DISPATCH = AssignmentRecipientPolicy::class.':delegate';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
    ];

    private const string REVIEWERS = '{"type":"profiles","version":1,"keys":["journal-reviewer"]}';

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
    }

    public function test_make_edit_preview_and_restore_run_end_to_end(): void
    {
        $this->artisan(
            'skill:make',
            [
                'key' => 'user-review-notes',
                '--description' => 'Review project notes',
                '--conditions' => self::REVIEWERS,
                '--body' => <<<'TEXT'
                ## Notes

                Read the notes first.
                TEXT,
            ],
        )
            ->expectsOutputToContain('Request id: ')
            ->expectsOutputToContain('revision 1 saved; publication pending.')
            ->expectsOutputToContain('Delivery: not yet delivered to any agent')
            ->assertSuccessful();
        $number = (string) Skill::query()->where('key', 'user-review-notes')->firstOrFail()->number;

        $this->artisan(
            'skill:edit',
            ['number' => $number, '--expected-revision' => 1, '--body' => <<<'TEXT'
            ## Notes

            Read the notes twice.
            TEXT],
        )
            ->expectsOutputToContain('revision 2 saved; publication pending.')
            ->assertSuccessful();
        $this->artisan(
            'skill:preview',
            ['key' => 'user-review-notes'],
        )->expectsOutputToContain('agents whose condition matches')->assertSuccessful();
        $this->artisan('skill:restore', ['number' => $number, '--revision' => 1, '--expected-revision' => 2])
            ->expectsOutputToContain('revision 3 saved; publication pending.')
            ->assertSuccessful();

        Artisan::call('skill:revision', ['number' => $number, 'revision' => 3]);
        $revision = Artisan::output();
        $this->assertStringContainsString('Read the notes first.', $revision);
        $this->assertStringContainsString('"keys":["journal-reviewer"]', $revision);
    }

    public function test_a_stale_edit_prints_the_conflict_with_the_latest_revision(): void
    {
        $this->artisan(
            'skill:make',
            ['key' => 'user-review-notes', '--description' => 'Review project notes', '--body' => 'Read the notes.'],
        )->assertSuccessful();
        $this->artisan(
            'skill:edit',
            ['number' => 'user-review-notes', '--expected-revision' => 1, '--body' => 'Again.'],
        )->assertSuccessful();

        $this->artisan(
            'skill:edit',
            ['number' => 'user-review-notes', '--expected-revision' => 1, '--body' => 'Stale.'],
        )
            ->expectsOutputToContain('The skill user-review-notes is at revision 2 now')
            ->assertFailed();
    }

    public function test_conditions_and_audience_flags_are_not_mixed_and_flags_compile_to_one_all_group(): void
    {
        $this->artisan(
            'skill:make',
            [
                'key' => 'user-mixed',
                '--description' => 'Mixed',
                '--body' => 'Text.',
                '--conditions' => self::REVIEWERS,
                '--ability' => [self::DISPATCH],
            ],
        )
            ->expectsOutputToContain('cannot be mixed with audience flags')
            ->assertFailed();

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-codex-main',
                '--description' => 'Codex main',
                '--body' => 'Text.',
                '--ability' => [self::DISPATCH],
                '--driver' => ['codex'],
            ],
        )->assertSuccessful();

        Artisan::call('skill:revision', ['number' => 'user-codex-main', 'revision' => 1]);
        $this->assertStringContainsString(json_encode(['type' => 'all', 'version' => 1, 'children' => [
            ['type' => 'programs', 'version' => 1, 'keys' => ['codex']],
            ['type' => 'abilities', 'version' => 1, 'keys' => [self::DISPATCH]],
        ]], JSON_THROW_ON_ERROR), Artisan::output());
    }

    public function test_editing_a_shipped_skill_offers_a_copy(): void
    {
        $this->artisan('skill:edit', ['number' => 'journal-plans', '--expected-revision' => 1, '--body' => 'Mine.'])
            ->expectsOutputToContain('copy it to a user- key')
            ->assertFailed();
    }
}
