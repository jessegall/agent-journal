<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Skills\Enums\GenerationState;
use App\Skills\Enums\PublicationState;
use App\Skills\Exceptions\SkillGenerationImmutable;
use App\Skills\Exceptions\SkillPublicationFailed;
use App\Skills\Exceptions\SkillPublicationStale;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Values\PublicationManifest;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Schema;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A generation keeps its rendered entries unchanged; a publication moves only forward through its states under a
 * fencing version, so a stale worker cannot overwrite a newer one.
 */
final class SkillPublicationModelsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['skill_publications', 'skill_generations'];

    public function test_the_tables_exist_and_a_ready_generation_keeps_its_entries(): void
    {
        $this->assertTrue(Schema::hasTable('skill_generations'));
        $this->assertTrue(Schema::hasTable('skill_publications'));

        $generation = $this->generation();
        $this->assertSame(GenerationState::Ready, SkillGeneration::latestReady()?->state);
        $this->assertSame('journal', $generation->entry('journal')['key'] ?? null);

        $generation->entries = [];
        $this->expectException(SkillGenerationImmutable::class);

        $generation->save();
    }

    public function test_a_publication_goes_from_pending_to_delivered_and_never_back_to_pending(): void
    {
        $publication = SkillPublication::intend(TestIds::of(1), 'codex', '/work/.agents/skills', $this->generation(), str_repeat('a', 64), ['journal']);
        $fence = $publication->claim('worker-1', CarbonImmutable::now()->addMinute());
        $publication->recordProgress($fence, 1);
        $publication->deliver($fence, new PublicationManifest('generation', $publication->id, 'session', 'claude', 'selection', ['journal/SKILL.md' => str_repeat('b', 64)]));

        $this->assertSame(PublicationState::Delivered, $publication->state);
        $this->expectException(SkillPublicationFailed::class);

        $publication->retry();
    }

    public function test_an_older_fence_is_refused_and_a_new_intent_supersedes_the_open_one(): void
    {
        $generation = $this->generation();
        $first = SkillPublication::intend(TestIds::of(1), 'codex', '/work/.agents/skills', $generation, str_repeat('a', 64), ['journal']);
        $old = $first->claim('worker-1', CarbonImmutable::now()->subMinute());
        $first->claim('worker-2', CarbonImmutable::now()->addMinute());

        try {
            $first->recordProgress($old, 3);
            $this->fail('A stale fence was accepted.');
        } catch (SkillPublicationStale $refusal) {
            $this->assertStringContainsString('a newer worker owns it', $refusal->getMessage());
        }

        $second = SkillPublication::intend(TestIds::of(1), 'codex', '/work/.agents/skills', $generation, str_repeat('c', 64), ['journal']);

        $this->assertSame(PublicationState::Superseded, $first->refresh()->state);
        $this->assertSame(PublicationState::Pending, $second->state);
    }

    public function test_a_failed_publication_is_retried_with_the_same_generation(): void
    {
        $publication = SkillPublication::intend(TestIds::of(1), 'codex', '/work/.agents/skills', $this->generation(), str_repeat('a', 64), ['journal']);
        $publication->claim('worker-1', CarbonImmutable::now()->addMinute());
        $publication->fail('disk full');
        $generationId = $publication->generation_id;

        $publication->retry();

        $this->assertSame(PublicationState::Pending, $publication->state);
        $this->assertSame($generationId, $publication->generation_id);
        $this->assertNull($publication->error);
    }

    private function generation(): SkillGeneration
    {
        return SkillGeneration::ready(str_repeat('d', 64), str_repeat('e', 64), [['key' => 'journal', 'owner' => 'Core', 'revision' => null, 'markdown' => "# Journal\n", 'digest' => hash('sha256', "# Journal\n")]]);
    }
}
