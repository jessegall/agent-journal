<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Skills\Commands\PrepareSkillPublication\PrepareSkillPublicationCommand;
use App\Skills\Commands\PublishSkills\PublishSkillsCommand;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\HostSkillPublisher;
use App\Skills\Support\SkillPublishing;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\TestCase;

/**
 * A pending publication is staged in bounded steps and activated by switching the journal's own pointer; a failed
 * write keeps the previous pointer, a target the journal does not own is left alone, and a stale worker stops.
 */
final class SkillPublishingTest extends TestCase
{
    use CommitsHookRows;
    use HasSkillTargets;
    use IntendsSkillPublications;
    use RunsTrustedCommands;

    private const string FIRST_TEXT = <<<'TEXT'
        # Journal

        First text.

        TEXT;

    private const string NO_SPACE = 'no space left';

    private const string OWN_SKILL = 'My own skill.';

    private const string FOREIGN_FILES = 'holds files the journal did not create';

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    public function test_a_pending_publication_ends_delivered_with_skill_files_and_a_manifest_at_the_target(): void
    {
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationState::Delivered, $this->publishing()->publish($publication->id, 'worker-1'));

        $target = $this->target();
        $this->assertTrue(is_link($target));
        $this->assertSame(self::FIRST_TEXT, File::get("{$target}/skills/journal/SKILL.md"));
        $manifest = json_decode(File::get("{$target}/manifest.json"), true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame(hash('sha256', <<<'TEXT'
        # Journal

        First text.

        TEXT), $manifest['files']['skills/journal/SKILL.md']);
        $this->assertSame(PublicationState::Delivered, $publication->refresh()->state);
        $plugin = json_decode(File::get("{$target}/.claude-plugin/plugin.json"), true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame('journal-session-skills', $plugin['name']);
    }

    public function test_a_failed_write_keeps_the_previous_pointer_and_records_failed(): void
    {
        $this->publishing()->publish($this->intend('First text.')->id, 'worker-1');
        $before = (string) readlink($this->target());
        $this->app->instance(SkillPublisher::class, new FullDiskPublisher($this->app->make(HostSkillPublisher::class)));
        $second = $this->intend('Second text.');

        $this->assertSame(PublicationState::Failed, $this->publishing()->publish($second->id, 'worker-1'));
        $this->assertSame($before, readlink($this->target()));
        $this->assertSame(PublicationState::Failed, $second->refresh()->state);
        $this->assertStringContainsString(self::NO_SPACE, (string) $second->error);
    }

    public function test_an_unowned_skill_folder_at_the_target_is_refused_and_left_untouched(): void
    {
        File::makeDirectory($this->target().'/mine', recursive: true);
        File::put($this->target().'/mine/SKILL.md', 'My own skill.');
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationState::Failed, $this->publishing()->publish($publication->id, 'worker-1'));
        $this->assertSame(self::OWN_SKILL, File::get($this->target().'/mine/SKILL.md'));
        $this->assertStringContainsString(
            self::FOREIGN_FILES,
            (string) $publication->refresh()->error,
        );
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

    private function publishing(): SkillPublishing
    {
        return $this->app->make(SkillPublishing::class);
    }
}
