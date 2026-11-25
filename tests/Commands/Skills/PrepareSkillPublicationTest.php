<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * The worker holding a publication stages its files and is told how far it got; a worker whose fence another claim
 * has passed is stopped.
 */
#[TestsCommand(PrepareSkillPublicationCommand::class)]
final class PrepareSkillPublicationTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_the_holder_stages_every_file_and_is_told_how_far_it_got(): void
    {
        $publication = $this->intend('First text.');
        $claim = $this->journal->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));

        $progress = $this->journal->asSystem(new PrepareSkillPublicationCommand($publication->id, $claim->fence));

        $this->assertSame($claim->files, $progress->staged);
        $this->assertSame($claim->files, $publication->refresh()->progress);
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
