<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\SessionStatus;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Domains\Support\DomainRegistry;
use App\Skills\Commands\CreateSkill;
use App\Skills\Commands\RefreshSkills;
use App\Skills\Enums\GenerationState;
use App\Skills\Enums\PublicationState;
use App\Skills\Models\SkillGeneration;
use App\Skills\Models\SkillPublication;
use App\Skills\Support\CoreSkills;
use App\Skills\Support\SkillRegistry;
use App\Skills\Values\RefreshResult;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Skills\Values\SkillOwner;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Skills\Guide\BrokenGuideSkill;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A refresh renders the catalogue as one immutable generation, reuses it when nothing changed, keeps the last good one
 * when a shipped skill is broken, and asks for a publication for each running session whose selection changed.
 */
final class RefreshSkillsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsBuiltInProfiles;
    use RunsTrustedCommands;

    private const array TABLES = ['skill_publications', 'skill_generations', 'skill_requests', 'skill_revisions', 'skills', 'number_groups', 'command_receipts', 'agent_sessions', 'agents'];

    public function test_two_refreshes_without_changes_leave_one_generation_and_no_new_publications(): void
    {
        $this->launch();

        $first = $this->refresh();
        $second = $this->refresh();

        $this->assertFalse($first->reused);
        $this->assertSame(1, $first->publications);
        $this->assertTrue($second->reused);
        $this->assertSame(0, $second->publications);
        $this->assertSame(1, SkillGeneration::query()->count());
        $this->assertSame(1, SkillPublication::query()->count());
    }

    public function test_a_broken_shipped_skill_fails_the_generation_naming_owner_and_key_and_the_previous_stays_ready(): void
    {
        $ready = $this->refresh();
        $this->useOwners(...[...$this->installedOwners(), new SkillOwner('Guide', base_path('tests/Fixtures/Skills/Guide'), [BrokenGuideSkill::class], true)]);

        $failed = $this->refresh();

        $this->assertTrue($failed->failed);
        $this->assertStringContainsString("Guide's skill journal-guide is invalid", $failed->reason);
        $this->assertSame(GenerationState::Failed, SkillGeneration::query()->whereKey($failed->generationId)->firstOrFail()->state);
        $this->assertSame($ready->generationId, SkillGeneration::latestReady()?->id);
    }

    public function test_a_stored_edit_leads_to_a_pending_publication_for_a_running_session(): void
    {
        $session = $this->launch();
        $this->refresh();
        SkillPublication::query()->where('session_id', $session->id)->firstOrFail()->supersede();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new CreateSkill('user-review-notes', 'create-1', new SkillDraft('Review notes', 'Read.', [new SectionDraft('notes', 'Notes', 'Text.')], '')));

        $pending = SkillPublication::query()->where('session_id', $session->id)->where('state', PublicationState::Pending->value)->firstOrFail();
        $this->assertSame(2, SkillGeneration::query()->count());
        $this->assertSame(SkillGeneration::latestReady()?->id, $pending->generation_id);
        $this->assertStringEndsWith("/targets/{$session->id}/claude-code", $pending->target);
    }

    public function test_only_the_system_refreshes(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));

        $this->expectException(CommandNotRegistered::class);

        $this->app->make(CommandBus::class)->run(new RefreshSkills());
    }

    private function refresh(): RefreshResult
    {
        $this->app->forgetScopedInstances();

        return $this->throughEntry(new RefreshSkills());
    }

    private function launch(): AgentSession
    {
        $agent = Agent::named('Main', 'main-agent');
        $session = new AgentSession(TestSelections::sessionColumns());
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
