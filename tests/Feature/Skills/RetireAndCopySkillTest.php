<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Skills\Commands\CopySkill;
use App\Skills\Commands\CreateSkill;
use App\Skills\Commands\RetireSkill;
use App\Skills\Contracts\SkillReader;
use App\Skills\Exceptions\SkillOwnerRequired;
use App\Skills\Models\Skill;
use App\Skills\Models\SkillRevision;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillKey;
use App\Skills\Values\SkillRevisionResult;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner retires a stored skill, which leaves the catalogue but keeps its history; any user copies a skill they may
 * read into a user- skill whose first revision holds the copied text and where it came from.
 */
final class RetireAndCopySkillTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['skill_publications', 'skill_generations', 'skill_requests', 'skill_revisions', 'skills', 'number_groups', 'command_receipts'];

    public function test_retire_removes_the_skill_from_the_list_and_keeps_its_revisions(): void
    {
        $created = $this->as(7, new CreateSkill('user-review-notes', 'create-1', new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], '')));
        $this->as(7, new RetireSkill($created->skillId, 1, 'retire-1'));

        Artisan::call('skill:list', ['--json' => true]);
        $this->assertNotContains('user-review-notes', array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'key'));
        $this->assertCount(1, SkillRevision::historyOf(Skill::query()->whereKey($created->skillId)->firstOrFail(), 10));
    }

    public function test_another_owner_cannot_retire_it(): void
    {
        $created = $this->as(7, new CreateSkill('user-review-notes', 'create-1', new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], '')));

        $this->expectException(SkillOwnerRequired::class);

        $this->as(8, new RetireSkill($created->skillId, 1, 'retire-1'));
    }

    public function test_copying_journal_plans_snapshots_its_text_and_source_digest(): void
    {
        $source = $this->app->make(SkillReader::class)->find(SkillKey::from('journal-plans'));
        $copied = $this->as(7, new CopySkill('journal-plans', 'user-plans', 'copy-1'));
        $revision = SkillRevision::currentOf(Skill::query()->whereKey($copied->skillId)->firstOrFail());

        $this->assertSame(1, $copied->revision);
        $this->assertSame('journal-plans', $revision->source_key);
        $this->assertSame($source->rendered->digest, $revision->source_digest);
        $this->assertStringContainsString('`plan:assigned` lists the plans you hold.', (string) $revision->sections[0]->content);
        $this->assertSame($source->condition->toArray(), $revision->condition);
    }

    /**
     * @param  Command<SkillRevisionResult>  $command
     */
    private function as(int $user, Command $command): SkillRevisionResult
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of($user)));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
