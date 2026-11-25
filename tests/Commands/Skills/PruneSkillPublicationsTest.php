<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\FailSkillPublication\FailSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PruneSkillPublications\PruneSkillPublicationsCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * A prune retires a publication that ended more than thirty days ago and keeps a recent one.
 */
final class PruneSkillPublicationsTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;
    use RunsTrustedCommands;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_an_old_failed_publication_is_retired_and_a_recent_one_kept(): void
    {
        $publication = $this->intend('First text.');
        $this->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));
        $this->asSystem(new FailSkillPublicationCommand($publication->id, 'no space left'));

        $recent = $this->asSystem(new PruneSkillPublicationsCommand());
        $this->travel(31)->days();
        $old = $this->asSystem(new PruneSkillPublicationsCommand());

        $this->assertSame([0, 1], [$recent->retired, $old->retired]);
        $this->assertSame(PublicationStatus::Retired, $publication->refresh()->status);
    }

    public function test_a_worker_with_an_older_fence_is_stopped(): void
    {
        $publication = $this->intend('First text.');
        $first = $this->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));
        SkillPublication::query()->whereKey($publication->id)->firstOrFail()->claim(
            'worker-2',
            CarbonImmutable::now()->addMinute(),
        );

        $this->expectException(SkillPublicationStale::class);

        $this->asSystem(new PrepareSkillPublicationCommand($publication->id, $first->fence));
    }
}
