<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Skills\ConditionOutcome;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Resolvers\Support\SkillContextResolver;
use App\Support\Conditions\Conditions;
use App\Values\ProfileBase;
use App\Values\SkillContext;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Skill conditions read one context per request: the agent's trusted role, the profile revision its session was
 * started with, and its driver and provider; each request in a worker builds its own.
 */
final class SkillContextResolverTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;

    private const array TABLES = ['agent_sessions', 'agents', 'profile_revisions', 'profiles'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    public function test_a_main_agent_session_matches_main_agent_and_a_helper_on_the_same_program_does_not(): void
    {
        $this->activateReviewer('Review.');
        [$main, $mainSession] = $this->start('main-agent', null);
        [$helper, $helperSession] = $this->start('read-only-helper', 1);

        $this->journal->actAsAgentIds($main->id, $mainSession->id);
        $mainContext = $this->app->make(SkillContext::class);
        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds($helper->id, $helperSession->id);
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

        $this->journal->actAsAgentIds($helper->id, $session->id);
        $context = $this->app->make(SkillContextResolver::class)->current();

        $this->assertSame(1, $context->profile->snapshot?->revision);
        $this->assertSame('First.', $context->profile->snapshot?->instructions);
    }

    private function activateReviewer(string $instructions): void
    {
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile('journal-reviewer', ProfileBase::readOnlyHelper(), $instructions),
        )));
    }

    /**
     * @return array{Agent, AgentSession}
     */
    private function start(string $profileKey, int|null $profileRevision): array
    {
        $agent = Agent::create('Agent '.TestSelections::requestId(), $profileKey, $this->localProject());
        $session = new AgentSession()->forceFill(
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
