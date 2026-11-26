<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Commands\Skills\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use App\Support\PublicationFiles;
use App\Support\SkillPublishingService;
use App\Support\SkillTargets;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\File;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * A prune retires a publication that ended more than thirty days ago and keeps a recent one.
 */
#[TestsCommand(PruneSkillPublicationsCommand::class)]
final class PruneSkillPublicationsTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'command_receipts',
    ];

    private const string FOURTH_TEXT = <<<'TEXT'
        # Journal

        Fourth text.

        TEXT;

    private const string EDITED_BY_HAND = 'Edited by hand.';

    public function test_an_old_failed_publication_is_retired_and_a_recent_one_kept(): void
    {
        $publication = $this->intend('First text.');
        $this->journal->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));
        $this->journal->asSystem(new FailSkillPublicationCommand($publication->id, 'no space left'));

        $recent = $this->journal->asSystem(new PruneSkillPublicationsCommand());
        $this->travel(31)->days();
        $old = $this->journal->asSystem(new PruneSkillPublicationsCommand());

        $this->assertSame([0, 1], [$recent->retired, $old->retired]);
        $this->assertSame(PublicationStatus::Retired, $publication->refresh()->status);
    }

    public function test_a_worker_with_an_older_fence_is_stopped(): void
    {
        $publication = $this->intend('First text.');
        $first = $this->journal->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));
        SkillPublication::query()->whereKey($publication->id)->firstOrFail()->claim(
            'worker-2',
            CarbonImmutable::now()->addMinute(),
        );

        $this->expectException(SkillPublicationStale::class);

        $this->journal->asSystem(new PrepareSkillPublicationCommand($publication->id, $first->fence));
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

    private function stagingFolder(SkillPublication $publication): string
    {
        return PublicationFiles::of(
            $publication,
            $this->app->make(SkillTargets::class),
            $this->app->make(DriverSkillAdapters::class),
        )->stagingFolder;
    }

    private function delivered(string $text): SkillPublication
    {
        $publication = $this->intend($text);
        $this->assertSame(PublicationStatus::Delivered, $this->publishing()->publish($publication->id, 'worker-1'));

        return $publication->refresh();
    }

    private function publishing(): SkillPublishingService
    {
        return $this->app->make(SkillPublishingService::class);
    }
}
