<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Commands\Skills\RetrySkillPublication\RetrySkillPublicationCommand;
use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use App\Support\SkillPublisher;
use App\Support\SkillPublishingService;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A failed publication is tried again: it is pending once more without its error.
 */
final class RetrySkillPublicationTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'command_receipts',
    ];

    private const string FIRST_TEXT = <<<'TEXT'
        # Journal

        First text.

        TEXT;

    public function test_a_failed_publication_is_pending_again_without_its_error(): void
    {
        $publication = $this->intend('First text.');
        $this->journal->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));
        $this->journal->asSystem(new FailSkillPublicationCommand($publication->id, 'no space left'));

        $this->journal->asSystem(new RetrySkillPublicationCommand($publication->id));

        $this->assertSame([PublicationStatus::Pending, null], [$publication->refresh()->status, $publication->error]);
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

    public function test_retry_delivers_a_failed_publication_once_its_cause_is_fixed(): void
    {
        $this->app->instance(
            SkillPublisherContract::class,
            new FullDiskPublisher($this->app->make(SkillPublisher::class)),
        );
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

    private function publishing(): SkillPublishingService
    {
        return $this->app->make(SkillPublishingService::class);
    }
}
