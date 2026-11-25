<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Skills\CreateSkill\CreateSkillCommand;
use App\Commands\Skills\RefreshSkills\RefreshSkillsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Skills\GenerationStatus;
use App\Enums\Skills\PublicationStatus;
use App\Exceptions\CommandNotRegistered;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillPublication;
use App\Support\CoreSkills;
use App\Support\DomainRegistry;
use App\Support\SkillRegistry;
use App\Values\RefreshResult;
use App\Values\SectionDraft;
use App\Values\SkillDraft;
use App\Values\SkillOwner;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Skills\Guide\BrokenGuideSkill;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A refresh renders the catalogue as one immutable generation, reuses it when nothing changed, keeps the last good one
 * when a shipped skill is broken, and asks for a publication for each running session whose selection changed.
 */
final class RefreshSkillsTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const string INVALID_SKILL = "Guide's skill journal-guide is invalid";

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agent_sessions',
        'agents',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    public function test_two_refreshes_without_changes_leave_one_generation_and_no_new_publications(): void
    {
        $this->start();

        $first = $this->refresh();
        $second = $this->refresh();

        $this->assertFalse($first->isReused);
        $this->assertSame(1, $first->publications);
        $this->assertTrue($second->isReused);
        $this->assertSame(0, $second->publications);
        $this->assertSame(1, SkillGeneration::query()->count());
        $this->assertSame(1, SkillPublication::query()->count());
    }

    public function test_a_broken_shipped_skill_fails_its_generation_by_owner_and_key_and_the_last_stays_ready(): void
    {
        $ready = $this->refresh();
        $this->useOwners(
            ...[
                ...$this->installedOwners(),
                new SkillOwner('Guide', base_path('tests/Fixtures/Skills/Guide'), [BrokenGuideSkill::class], true),
            ],
        );

        $failed = $this->refresh();

        $this->assertTrue($failed->hasFailed);
        $this->assertStringContainsString(self::INVALID_SKILL, $failed->reason);
        $this->assertSame(
            GenerationStatus::Failed,
            SkillGeneration::query()->whereKey($failed->generationId)->firstOrFail()->status,
        );
        $this->assertSame($ready->generationId, SkillGeneration::findLatestReady()?->id);
    }

    public function test_a_stored_edit_leads_to_a_pending_publication_for_a_running_session(): void
    {
        $session = $this->start();
        $this->refresh();
        SkillPublication::query()->where('session_id', $session->id)->firstOrFail()->supersede();

        $this->actAs(TestActors::user(7));
        $this->app->make(CommandBus::class)->run(
            new CreateSkillCommand(
                'user-review-notes',
                'create-1',
                new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], ''),
            ),
        );

        $pending = SkillPublication::query()->where('session_id', $session->id)->where(
            'status',
            PublicationStatus::Pending->value,
        )->firstOrFail();
        $this->assertSame(2, SkillGeneration::query()->count());
        $this->assertSame(SkillGeneration::findLatestReady()?->id, $pending->generation_id);
        $this->assertStringEndsWith("/targets/{$session->id}/claude-code", $pending->target);
    }

    public function test_only_the_system_refreshes(): void
    {
        $this->actAs(TestActors::user(7));

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new RefreshSkillsCommand());
    }

    private function refresh(): RefreshResult
    {
        $this->app->forgetScopedInstances();

        return $this->journal->throughEntry(new RefreshSkillsCommand());
    }

    private function start(): AgentSession
    {
        $agent = Agent::create('Main', 'main-agent', $this->localProject());
        $session = new AgentSession()->forceFill(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    /**
     * @return list<SkillOwner>
     */
    private function installedOwners(): array
    {
        return $this->app->make(DomainRegistry::class)->skillDeclarations(CoreSkills::owner());
    }

    private function useOwners(SkillOwner ...$owners): void
    {
        $this->app->instance(SkillRegistry::class, SkillRegistry::of(array_values($owners)));
    }
}
