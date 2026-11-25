<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\CopySkill\CopySkillCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Skills\SkillResolver;
use App\Models\Skills\Skill;
use App\Models\Skills\SkillRevision;
use App\Support\DomainRegistry;
use App\Values\OwnerAuthority;
use App\Values\SkillKey;
use App\Values\SkillRevisionResult;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Copying a shipped skill snapshots its text and the digest of its source.
 */
final class CopySkillTest extends TestCase
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
