<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\CopySkill\CopySkillCommand;
use App\Commands\CreateSkill\CreateSkillCommand;
use App\Commands\RetireSkill\RetireSkillCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Skills\SkillResolver;
use App\Exceptions\SkillOwnerRequired;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Values\OwnerAuthority;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillKey;
use App\Values\SkillRevisionResult;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The owner retires a stored skill, which leaves the catalogue but keeps its history; any user copies a skill they may
 * read into a user- skill whose first revision holds the copied text and where it came from.
 */
final class RetireAndCopySkillTest extends TestCase
{
    use CommitsHookRows;

    private const string ASSIGNED_LINE = '`plan:assigned` lists the plans you hold.';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
    ];

    public function test_retire_removes_the_skill_from_the_list_and_keeps_its_revisions(): void
    {
        $created = $this->as(
            7,
            new CreateSkillCommand(
                'user-review-notes',
                'create-1',
                new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], ''),
            ),
        );
        $this->as(7, new RetireSkillCommand($created->skillId, 1, 'retire-1'));

        Artisan::call('skill:list', ['--json' => true]);
        $this->assertNotContains(
            'user-review-notes',
            array_column(json_decode(Artisan::output(), true, flags: JSON_THROW_ON_ERROR), 'key'),
        );
        $this->assertCount(1, SkillRevision::historyOf(Skill::query()->whereKey($created->skillId)->firstOrFail(), 10));
    }

    public function test_another_owner_cannot_retire_it(): void
    {
        $created = $this->as(
            7,
            new CreateSkillCommand(
                'user-review-notes',
                'create-1',
                new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], ''),
            ),
        );

        $this->expectException(SkillOwnerRequired::class);

        $this->as(8, new RetireSkillCommand($created->skillId, 1, 'retire-1'));
    }

    public function test_copying_journal_plans_snapshots_its_text_and_source_digest(): void
    {
        $source = $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-plans'));
        $copied = $this->as(7, new CopySkillCommand('journal-plans', 'user-plans', 'copy-1'));
        $revision = SkillRevision::currentOf(Skill::query()->whereKey($copied->skillId)->firstOrFail());

        $this->assertSame(1, $copied->revision);
        $this->assertSame('journal-plans', $revision->source_key);
        $this->assertSame($source->rendered->digest, $revision->source_digest);
        $this->assertStringContainsString(
            self::ASSIGNED_LINE,
            (string) $revision->sections[0]->content,
        );
        $this->assertSame($source->condition->toArray(), $revision->condition);
    }

    /**
     * @param  Command<SkillRevisionResult>  $command
     */
    private function as(int $user, Command $command): SkillRevisionResult
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user($user), new OwnerAuthority('test'));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
