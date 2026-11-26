<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Access\AccessSettings;
use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\CurrentActorSetter;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Skills\Commands\CopySkill\CopySkillCommand;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Values\SkillRevisionResult;
use App\Support\DomainRegistry;
use App\Values\SkillKey;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Copying a shipped skill snapshots its text and the digest of its source.
 */
#[TestsCommand(CopySkillCommand::class)]
final class CopySkillTest extends TestCase
{
    use CommitsHookRows;

    private const string ASSIGNED_LINE = '`plan:assigned` lists the plans you hold.';

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

    public function test_copying_journal_plans_snapshots_its_text_and_source_digest(): void
    {
        $source = $this->app->make(SkillResolver::class)->find(SkillKey::from('journal-plans'));
        $copied = $this->as(7, new CopySkillCommand('journal-plans', 'user-plans', 'copy-1'));
        $revision = SkillRevision::findCurrentOf(Skill::query()->whereKey($copied->skillId)->firstOrFail());

        $this->assertSame(1, $copied->revision);
        $this->assertSame('journal-plans', $revision->source_key);
        $this->assertSame($source->rendered->digest, $revision->source_digest);
        $this->assertStringContainsString(
            self::ASSIGNED_LINE,
            (string) $revision->sections[0]->content,
        );
        $this->assertEquals($source->condition->toArray(), $revision->condition->toArray());
    }

    public function test_editing_a_shipped_skill_offers_a_copy(): void
    {
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));

        $this->artisan('skill:edit', ['number' => 'journal-plans', '--expected-revision' => 1, '--body' => 'Mine.'])
            ->expectsOutputToContain('copy it to a user- key')
            ->assertFailed();
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
