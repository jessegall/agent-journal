<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\ActivateSkillPublication\ActivateSkillPublicationCommand;
use App\Commands\Skills\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\SkillPublicationFailed;
use App\Exceptions\SkillPublicationStale;
use App\Models\Skills\SkillPublication;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * The holder of a publication whose files are all staged makes it the target's active skills and it is delivered;
 * a publication with files still to stage is refused and stays undelivered.
 */
final class ActivateSkillPublicationTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;
    use RunsTrustedCommands;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_a_fully_staged_publication_is_delivered_and_a_partial_one_is_refused(): void
    {
        $publication = $this->intend('First text.');
        $claim = $this->asSystem(new PublishSkillsCommand($publication->id, 'worker-1'));

        $this->assertThrows(
            fn () => $this->asSystem(new ActivateSkillPublicationCommand($publication->id, $claim->fence)),
            SkillPublicationFailed::class,
        );

        $this->asSystem(new PrepareSkillPublicationCommand($publication->id, $claim->fence));
        $this->asSystem(new ActivateSkillPublicationCommand($publication->id, $claim->fence));

        $this->assertSame(PublicationStatus::Delivered, $publication->refresh()->status);
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
