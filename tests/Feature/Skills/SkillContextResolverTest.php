<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\ConditionOutcome;
use App\Enums\SessionStatus;
use App\Exceptions\SkillAgentHidden;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\Conditions\Conditions;
use App\Values\ProfileBase;
use App\Values\SkillContext;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\ActsAsActors;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Skill conditions read one context per request: the agent's trusted role, the profile revision its session was
 * started with, and its driver and provider; each request in a worker builds its own.
 */
final class SkillContextResolverTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;
    use HasContainerSupport;
    use InstallsBuiltInProfiles;
    use StartsAgentRequests;

    private const array TABLES = ['agent_sessions', 'agents', 'profile_revisions', 'profiles'];

    public function test_a_main_agent_session_matches_main_agent_and_a_helper_on_the_same_program_does_not(): void
    {
        $this->activateReviewer('Review.');
        [$main, $mainSession] = $this->start('main-agent', null);
        [$helper, $helperSession] = $this->start('read-only-helper', 1);

        $this->startRequestAs($main->id, $mainSession->id);
        $mainContext = $this->app->make(SkillContext::class);
        $this->app->forgetScopedInstances();
        $this->startRequestAs($helper->id, $helperSession->id);
        $helperContext = $this->app->make(SkillContext::class);

        $this->assertSame(ConditionOutcome::Match, Conditions::dispatchesWork()->evaluate($mainContext)->outcome);
        $this->assertSame(ConditionOutcome::NoMatch, Conditions::dispatchesWork()->evaluate($helperContext)->outcome);
        $this->assertSame(ProfileBase::mainAgent()->key, $mainContext->profile->snapshot?->base->key);
        $this->assertSame('claude-code', $helperContext->driver?->key);
        $this->assertSame('anthropic', $helperContext->provider?->key);
        $this->assertSame(ProfileBase::readOnlyHelper()->key, $helperContext->profile->snapshot?->base->key);
    }

    public function test_a_session_keeps_the_profile_revision_it_was_started_with(): void
    {
        $this->activateReviewer('First.');
        [$helper, $session] = $this->start('read-only-helper', 1);
        $this->activateReviewer('Second.');

        $this->startRequestAs($helper->id, $session->id);
        $context = $this->app->make(SkillContextResolver::class)->current();

        $this->assertSame(1, $context->profile->snapshot?->revision);
        $this->assertSame('First.', $context->profile->snapshot?->instructions);
    }

    public function test_two_requests_in_one_worker_get_their_own_contexts(): void
    {
        [$first, $firstSession] = $this->start('main-agent', null);
        [$second, $secondSession] = $this->start('main-agent', null);

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
        [$main, $mainSession] = $this->start('main-agent', null);
        [$other] = $this->start('main-agent', null);
        $this->startRequestAs($main->id, $mainSession->id);
        $resolver = $this->app->make(SkillContextResolver::class);

        $this->assertSame($main->id, $resolver->forAgent($main)->actor->id);

        $this->expectException(SkillAgentHidden::class);

        $resolver->forAgent($other);
    }

    private function activateReviewer(string $instructions): void
    {
        $this->actAs(TestActors::user(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile('journal-reviewer', ProfileBase::readOnlyHelper(), $instructions),
        )));
    }

    /**
     * @return array{Agent, AgentSession}
     */
    private function start(string $profileKey, int|null $profileRevision): array
    {
        $agent = Agent::create('Agent '.TestSelections::requestId(), $profileKey);
        $session = new AgentSession(
            [
                ...TestSelections::sessionColumns(),
                'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer',
                'profile_revision' => $profileRevision ?? 1,
            ],
        );
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return [$agent, $session];
    }
}
