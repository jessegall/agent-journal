<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Support\ActorStore;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\PrepareSkillPublication;
use App\Skills\Commands\PublishSkills;
use App\Skills\Contracts\SkillPublisher;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\HostSkillPublisher;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A pending publication is staged in bounded steps and activated by switching the journal's own pointer; a failed
 * write keeps the previous pointer, a target the journal does not own is left alone, and a stale worker stops.
 */
final class SkillPublishingTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['skill_publications', 'skill_generations', 'command_receipts'];

    private string $root;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/journal-skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root, recursive: true);
        $this->root = (string) realpath($this->root);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_a_pending_publication_ends_delivered_with_skill_files_and_a_manifest_at_the_target(): void
    {
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationState::Delivered, $this->publishing()->publish($publication->id, 'worker-1'));

        $target = $this->target();
        $this->assertTrue(is_link($target));
        $this->assertSame("# Journal\n\nFirst text.\n", File::get("{$target}/skills/journal/SKILL.md"));
        $manifest = json_decode(File::get("{$target}/manifest.json"), true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame(hash('sha256', "# Journal\n\nFirst text.\n"), $manifest['files']['skills/journal/SKILL.md']);
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
        $this->assertStringContainsString('no space left', (string) $second->error);
    }

    public function test_an_unowned_skill_folder_at_the_target_is_refused_and_left_untouched(): void
    {
        File::makeDirectory($this->target().'/mine', recursive: true);
        File::put($this->target().'/mine/SKILL.md', 'My own skill.');
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationState::Failed, $this->publishing()->publish($publication->id, 'worker-1'));
        $this->assertSame('My own skill.', File::get($this->target().'/mine/SKILL.md'));
        $this->assertStringContainsString('holds files the journal did not create', (string) $publication->refresh()->error);
    }

    public function test_a_worker_with_an_older_fence_is_stopped(): void
    {
        $publication = $this->intend('First text.');
        $first = $this->asSystem(new PublishSkills($publication->id, 'worker-1'));
        SkillPublication::query()->whereKey($publication->id)->firstOrFail()->claim('worker-2', CarbonImmutable::now()->addMinute());

        $this->expectException(SkillPublicationStale::class);

        $this->asSystem(new PrepareSkillPublication($publication->id, $first->fence));
    }

    private function intend(string $text): SkillPublication
    {
        $markdown = "# Journal\n\n{$text}\n";
        $generation = SkillGeneration::ready(hash('sha256', $text), str_repeat('e', 64), [['key' => 'journal', 'owner' => 'Core', 'revision' => null, 'markdown' => $markdown, 'digest' => hash('sha256', $markdown)]]);

        return SkillPublication::intend(TestIds::of(1), 'claude-code', $this->target(), $generation, hash('sha256', $text), ['journal']);
    }

    private function target(): string
    {
        return "{$this->root}/targets/".TestIds::of(1).'/claude-code';
    }

    private function publishing(): SkillPublishing
    {
        return $this->app->make(SkillPublishing::class);
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asSystem(Command $command): mixed
    {
        return $this->app->make(ActorStore::class)->actAsSystem(fn () => $this->app->make(CommandBus::class)->run($command));
    }
}
