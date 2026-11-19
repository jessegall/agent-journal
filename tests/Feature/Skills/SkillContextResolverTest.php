<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\SessionStatus;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Enums\ProfileType;
use App\Skills\Conditions\Conditions;
use App\Skills\Enums\ConditionOutcome;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Resolvers\Support\SkillContextResolver;
use App\Skills\Values\SkillContext;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Skill conditions read one context per request: the agent's trusted role, the profile revision its session was
 * launched with, and its program and provider; each request in a worker builds its own.
 */
final class SkillContextResolverTest extends TestCase
{
    use CommitsHookRows;
    use InstallsBuiltInProfiles;
    use StartsAgentRequests;

    private const array TABLES = ['agent_sessions', 'agents', 'profile_revisions', 'profiles'];

    public function test_a_main_agent_session_matches_main_agent_and_a_helper_on_the_same_program_does_not(): void
    {
        $this->activateReviewer('Review.');
        [$main, $mainSession] = $this->launch(AgentRole::MainAgent, null);
        [$helper, $helperSession] = $this->launch(AgentRole::ReadOnlyHelper, 1);

        $this->startRequestAs($main->id, $mainSession->id);
        $mainContext = $this->app->make(SkillContext::class);
        $this->app->forgetScopedInstances();
        $this->startRequestAs($helper->id, $helperSession->id);
        $helperContext = $this->app->make(SkillContext::class);

        $this->assertSame(ConditionOutcome::Match, Conditions::mainAgent()->evaluate($mainContext)->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, Conditions::mainAgent()->evaluate($helperContext)->outcome);
        $this->assertSame(ProfileType::MainAgent, $mainContext->profile->snapshot?->type);
        $this->assertSame('claude-code', $helperContext->program?->key);
        $this->assertSame('anthropic', $helperContext->provider?->key);
        $this->assertSame(ProfileType::ReadOnlyHelper, $helperContext->profile->snapshot?->type);
    }

    public function test_a_session_keeps_the_profile_revision_it_was_launched_with(): void
    {
        $this->activateReviewer('First.');
        [$helper, $session] = $this->launch(AgentRole::ReadOnlyHelper, 1);
        $this->activateReviewer('Second.');

        $this->startRequestAs($helper->id, $session->id);
        $context = $this->app->make(SkillContextResolver::class)->current();

        $this->assertSame(1, $context->profile->snapshot?->revision);
        $this->assertSame('First.', $context->profile->snapshot?->instructions);
    }

    public function test_two_requests_in_one_worker_get_their_own_contexts(): void
    {
        [$first, $firstSession] = $this->launch(AgentRole::MainAgent, null);
        [$second, $secondSession] = $this->launch(AgentRole::MainAgent, null);

        $this->startRequestAs($first->id, $firstSession->id);
        $firstContext = $this->app->make(SkillContext::class);
        $this->assertSame($firstContext, $this->app->make(SkillContext::class));

        $this->app->forgetScopedInstances();
        $this->startRequestAs($second->id, $secondSession->id);
        $secondContext = $this->app->make(SkillContext::class);

        $this->assertSame($first->id, $firstContext->actor->id);
        $this->assertSame($second->id, $secondContext->actor->id);
    }

    public function test_a_preview_reads_only_an_agent_the_actor_may_see(): void
    {
        [$main, $mainSession] = $this->launch(AgentRole::MainAgent, null);
        [$other] = $this->launch(AgentRole::MainAgent, null);
        $this->startRequestAs($main->id, $mainSession->id);
        $resolver = $this->app->make(SkillContextResolver::class);

        $this->assertSame($main->id, $resolver->forAgent($main)->actor->id);

        $this->expectException(SkillAgentHidden::class);

        $resolver->forAgent($other);
    }

    private function activateReviewer(string $instructions): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile('journal-reviewer', ProfileType::ReadOnlyHelper, $instructions),
        )));
    }

    /**
     * @return array{Agent, AgentSession}
     */
    private function launch(AgentRole $role, int|null $profileRevision): array
    {
        $agent = Agent::named('Agent '.TestSelections::requestId(), $role);
        $session = new AgentSession([...TestSelections::sessionColumns(), 'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer', 'profile_revision' => $profileRevision ?? 1]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return [$agent, $session];
    }
}
