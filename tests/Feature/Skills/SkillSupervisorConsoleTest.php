<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Enums\Skills\PublicationStatus;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Support\Drivers\DriverSkillAdapters;
use App\Support\PublicationFiles;
use App\Support\SkillPublisher;
use App\Support\SkillPublishingService;
use App\Support\SkillTables;
use App\Support\SkillTargets;
use Carbon\CarbonImmutable;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The supervisor's console steps: refresh refuses before the tables exist, retry and resume finish what a failure or
 * a killed run left, prune keeps each target's current and previous set and never deletes a hand-edited file, and
 * the scheduler runs resume and prune.
 */
final class SkillSupervisorConsoleTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;

    private const string FIRST_TEXT = <<<'TEXT'
        # Journal

        First text.

        TEXT;

    private const string EDITED_BY_HAND = 'Edited by hand.';

    private const string FOURTH_TEXT = <<<'TEXT'
        # Journal

        Fourth text.

        TEXT;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_refresh_before_migrating_says_the_tables_are_missing_and_changes_nothing(): void
    {
        $this->app->instance(SkillTables::class, new SkillTables(
            $this->app->make(DatabaseManager::class)->connection()->getSchemaBuilder(),
            ['skill_generations', 'skill_tables_not_migrated'],
        ));

        $this->artisan('skill:refresh')
            ->expectsOutputToContain('The skills tables do not exist yet')
            ->assertFailed();

        $this->assertSame(0, SkillGeneration::query()->count());
    }

    public function test_retry_delivers_a_failed_publication_once_its_cause_is_fixed(): void
    {
        $this->app->instance(SkillPublisherContract::class, new FullDiskPublisher($this->app->make(SkillPublisher::class)));
        $publication = $this->intend('First text.');
        $this->publishing()->publish($publication->id, 'worker-1');
        $this->assertSame(PublicationStatus::Failed, $publication->refresh()->status);
        $this->app->forgetInstance(SkillPublisherContract::class);

        $this->artisan('skill:retry', ['publication' => $publication->id])
            ->expectsOutputToContain("Publication {$publication->id}: delivered.")
            ->assertSuccessful();

        $this->assertSame(PublicationStatus::Delivered, $publication->refresh()->status);
        $this->assertSame(self::FIRST_TEXT, File::get("{$this->target()}/skills/journal/SKILL.md"));
    }

    public function test_retry_of_an_unknown_publication_is_refused(): void
    {
        $this->artisan('skill:retry', ['publication' => TestIds::of(9)])
            ->expectsOutputToContain('No skill publication has the id')
            ->assertFailed();
    }

    public function test_resume_picks_up_a_publication_a_killed_run_left_preparing(): void
    {
        $publication = $this->intend('First text.');
        $publication->claim('killed-worker', CarbonImmutable::now()->subMinute());

        $this->artisan('skill:resume')
            ->expectsOutputToContain("Publication {$publication->id}: delivered.")
            ->assertSuccessful();

        $this->assertSame(PublicationStatus::Delivered, $publication->refresh()->status);
    }

    public function test_prune_removes_an_unused_set_keeps_current_and_previous_and_reports_a_hand_edited_file(): void
    {
        $oldest = $this->delivered('First text.');
        $edited = $this->delivered('Second text.');
        $previous = $this->delivered('Third text.');
        $current = $this->delivered('Fourth text.');
        File::put("{$this->stagingFolder($edited)}/skills/journal/SKILL.md", 'Edited by hand.');

        $this->artisan('skill:prune')
            ->expectsOutputToContain('was changed or added by hand')
            ->assertSuccessful();

        $this->assertDirectoryDoesNotExist($this->stagingFolder($oldest));
        $this->assertDirectoryDoesNotExist(dirname($this->stagingFolder($oldest)));
        $this->assertSame(self::EDITED_BY_HAND, File::get("{$this->stagingFolder($edited)}/skills/journal/SKILL.md"));
        $this->assertDirectoryExists($this->stagingFolder($previous));
        $this->assertDirectoryExists($this->stagingFolder($current));
        $this->assertSame(self::FOURTH_TEXT, File::get("{$this->target()}/skills/journal/SKILL.md"));
        $this->assertSame(PublicationStatus::Superseded, $oldest->refresh()->status);

        $this->travel(31)->days();
        $this->artisan('skill:prune')->expectsOutputToContain('Retired 1 publications.')->assertSuccessful();

        $this->assertSame(PublicationStatus::Retired, $oldest->refresh()->status);
        $this->assertSame(PublicationStatus::Superseded, $edited->refresh()->status);
        $this->assertSame(PublicationStatus::Delivered, $current->refresh()->status);
    }

    public function test_the_scheduler_runs_resume_every_minute_and_prune_daily(): void
    {
        $this->artisan('schedule:list')
            ->expectsOutputToContain('skill:resume')
            ->expectsOutputToContain('skill:prune')
            ->assertSuccessful();
    }

    private function delivered(string $text): SkillPublication
    {
        $publication = $this->intend($text);
        $this->assertSame(PublicationStatus::Delivered, $this->publishing()->publish($publication->id, 'worker-1'));

        return $publication->refresh();
    }

    private function stagingFolder(SkillPublication $publication): string
    {
        return PublicationFiles::of(
            $publication,
            $this->app->make(SkillTargets::class),
            $this->app->make(DriverSkillAdapters::class),
        )->stagingFolder;
    }

    private function publishing(): SkillPublishingService
    {
        return $this->app->make(SkillPublishingService::class);
    }
}
