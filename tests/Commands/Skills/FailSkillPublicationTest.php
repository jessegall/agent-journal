<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * A publication that could not be written is failed with its reason and lets go of its worker.
 */
final class FailSkillPublicationTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_a_failed_publication_keeps_its_reason_and_lets_go_of_its_worker(): void
    {
        $publication = $this->intend('First text.');
        $this->journal->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));

        $this->journal->asSystem(new FailSkillPublicationCommand($publication->id, 'no space left'));

        $publication->refresh();
        $this->assertSame(
            [PublicationStatus::Failed, 'no space left', null],
            [$publication->status, $publication->error, $publication->lease_holder],
        );
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
}
