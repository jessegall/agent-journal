<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Commands\CreateSkill\CreateSkillCommand;
use App\Skills\Commands\RetireSkill\RetireSkillCommand;
use App\Skills\Exceptions\SkillOwnerRequired;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillRevisionResult;
use App\Support\DomainRegistry;
use Illuminate\Support\Facades\Artisan;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Retiring a skill removes it from the list and keeps its revisions; another owner cannot retire it.
 */
#[TestsCommand(RetireSkillCommand::class)]
final class RetireSkillTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
    ];

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

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
        $this->assertCount(1, SkillRevision::findHistoryOf(Skill::query()->whereKey($created->skillId)->firstOrFail(), 10));
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
