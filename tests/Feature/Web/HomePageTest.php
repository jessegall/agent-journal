<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Rules\Models\Rule;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent session beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'messages',
        'links',
        'plans',
        'rules',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'message_attentions',
    ];

    private string $pairId;

    private User $owner;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::named('Builder', AgentRole::MainAgent);
        $this->session = $this->app->make(LaunchSessions::class)->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId())->session;
        $ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
        $this->pairId = $ownInboxId.'-'.$this->inboxOf(ActorIdentity::of($agent))->inboxId();
        Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_home_shows_the_running_sessions_and_the_same_plans_slice_as_the_plans_page(): void
    {
        $this->actingAs($this->owner)->get('/?window[plans.list][q]=release&q=elsewhere')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('web/Home')
            ->where('page.data.windows.0.paneKey', 'chat')
            ->where('page.data.windows.1.paneKey', 'plans')
            ->where('page.data.windows.2.paneKey', 'rules')
            ->where('page.data.barProps', ['section_web_bar_chat_agent'])
            ->missing('window_chat_conversation')
            ->missing('page.data.plans')
            ->missing('page.data.chat')
            ->reloadOnly('window_plans_list', fn (AssertableInertia $reload) => $reload
                ->where('window_plans_list.data.filters.q', 'release')
                ->where('window_plans_list.data.pagination.total', 1))
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.state', 'ready')
                ->where('window_chat_conversation.data.sessions.0.id', (string) $this->session->id)
                ->where('window_chat_conversation.data.sessions.0.agentName', 'Builder')
                ->missing('window_chat_conversation.data.conversation')));
    }

    public function test_the_rules_window_reads_its_own_search_and_page_beside_the_plans_window(): void
    {
        Rule::holding('Every phase ends with its tests.');
        Rule::holding('Write all code in plain English.');

        $this->actingAs($this->owner)->get('/?window[plans.list][q]=release&window[rules.list][q]=phase')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->missing('page.data.rules')
            ->reloadOnly(['window_plans_list', 'window_rules_list'], fn (AssertableInertia $reload) => $reload
                ->where('window_plans_list.data.filters.q', 'release')
                ->where('window_rules_list.data.filters.q', 'phase')
                ->where('window_rules_list.data.pagination.total', 1)
                ->where('window_rules_list.data.rows.0.text', 'Every phase ends with its tests.')));
    }

    public function test_a_sent_message_keeps_its_indentation_and_returns_to_the_conversation(): void
    {
        $body = "  Please check:\n    - the indented line\n\nthen answer.  \n";

        $home = route('home', ['window' => ['chat.conversation' => ['session' => (string) $this->session->id]], 'session' => (string) $this->session->id], false);

        $this->actingAs($this->owner)->post('/chat/messages', ['body' => $body, 'session' => (string) $this->session->id])
            ->assertStatus(303)
            ->assertRedirect($home);

        $this->assertSame([$body], Message::query()->withoutGlobalScopes()->pluck('body')->all());
        $this->actingAs($this->owner)->get($home)->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.id', $this->pairId)
                ->where('window_chat_conversation.data.conversation.sessionId', (string) $this->session->id)
                ->where('window_chat_conversation.data.conversation.messages.0.body', $body)));
    }

    public function test_the_chat_window_is_also_chats_own_page(): void
    {
        $this->actingAs($this->owner)->get("/chat?session={$this->session->id}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('chat/ChatWindow')
            ->where('page.state', 'ready')
            ->where('page.data.sessions.0.agentName', 'Builder')
            ->where('page.data.conversation.sessionId', (string) $this->session->id));
    }

    public function test_chats_dock_shows_the_plans_waiting_for_review_beside_the_chosen_session(): void
    {
        $waiting = Plan::factory()->create(['title' => 'Review the dock', 'type' => PlanType::Build]);
        Plan::query()->whereKey($waiting->id)->update(['state' => PlanState::Reviewing->value]);

        $this->actingAs($this->owner)->get("/chat?session={$this->session->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_chat_dock_plans_waiting', fn (AssertableInertia $section) => $section
                ->where('section_chat_dock_plans_waiting.state', 'ready')
                ->where('section_chat_dock_plans_waiting.data.rows.0.title', 'Review the dock')));
        $this->actingAs($this->owner)->get('/chat')->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_chat_dock_plans_waiting', fn (AssertableInertia $section) => $section
                ->where('section_chat_dock_plans_waiting', null)));
    }

    public function test_homes_bar_names_the_chosen_agent_through_chats_section(): void
    {
        $this->actingAs($this->owner)->get("/?session={$this->session->id}")->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_web_bar_chat_agent', fn (AssertableInertia $section) => $section
                ->where('section_web_bar_chat_agent.state', 'ready')
                ->where('section_web_bar_chat_agent.data.label', 'Builder')));
    }

    public function test_a_blank_message_is_refused_on_its_body(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/chat/messages', ['body' => "  \n\t ", 'session' => (string) $this->session->id])
            ->assertRedirect('/')
            ->assertSessionHasErrors('body');

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_guessed_session_is_refused_on_the_session(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/chat/messages', ['body' => 'Hello', 'session' => TestIds::of(99999)])
            ->assertRedirect('/')
            ->assertSessionHasErrors('session');
    }
}
