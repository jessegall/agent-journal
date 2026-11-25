<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Inboxes\LabeledInbox;
use App\Exceptions\InboxUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\StartSessions;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * The chat window picks the agent a user talks to: the idle main agent by default, no history for an agent the user
 * cannot see, and a pair chat even when the user's own inbox is missing.
 */
final class ChatWindowTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'messages',
        'links',
        'main_agent_designations',
        'driver_switches',
        'driver_conversations',
    ];

    private User $owner;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::create('Builder', 'main-agent', $this->localProject());

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $this->inboxOf(ActorIdentity::of($this->owner));
        $this->inboxOf(ActorIdentity::ofClass(Agent::class, $agent->id));
    }

    public function test_home_selects_the_idle_main_agent_and_offers_a_headless_helper_no_terminal(): void
    {
        $main = Agent::create('Main agent', 'main-agent', $this->localProject());
        MainAgentDesignation::create($main);

        $this->actingAs($this->owner)->get('/chat')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.isSetupRequired', false)
            ->where('page.data.selectedAgentId', $main->id)
            ->where('page.data.conversation.agentId', $main->id)
            ->where('page.data.conversation.sessionId', null)
            ->where('page.data.agents.0.name', 'Builder')
            ->where('page.data.agents.0.actions', ['switch'])
            ->where('page.data.agents.1.name', 'Main agent')
            ->where('page.data.agents.1.actions', ['start']));
    }

    public function test_an_agent_the_user_cannot_see_gets_no_history(): void
    {
        $this->actingAs($this->owner)
            ->get('/chat?agent='.strtolower((string) Str::ulid()))
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.state', 'denied')
                ->missing('page.data'));
    }

    public function test_a_missing_own_inbox_does_not_block_the_pair_chat(): void
    {
        $this->app->instance(ActorInboxResolver::class, new class implements ActorInboxResolver
        {
            public function preferredFor(Actor $actor): LabeledInbox
            {
                throw InboxUnavailable::forActor($actor->actorId());
            }
        });

        $this->actingAs($this->owner)
            ->get('/chat?agent='.$this->session->agent_id)
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.state', 'ready')
                ->where('page.data.conversation.agentId', $this->session->agent_id)
                ->missing('page.data.setupNotice'));
    }
}
