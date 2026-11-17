<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Agents\Actions\LaunchSessions;
use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Chat\Models\Message;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Rules\Models\Rule;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent session beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'messages', 'links', 'plans', 'rules'];

    private User $owner;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.main_ready']);
        $this->session = $this->app->make(LaunchSessions::class)->launch($agent, 'claude-code')->session;
        Plan::query()->create(['title' => 'Build the release page', 'kind' => PlanKind::Build]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_home_shows_the_running_sessions_and_the_same_plans_slice_as_the_plans_page(): void
    {
        $this->actingAs($this->owner)->get('/?window[plans.list][q]=release&q=elsewhere')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Home')
            ->missing('window_chat_conversation')
            ->missing('page.plans')
            ->missing('page.chat')
            ->reloadOnly('window_plans_list', fn (AssertableInertia $reload) => $reload
                ->where('window_plans_list.data.filters.q', 'release')
                ->where('window_plans_list.data.pagination.total', 1))
            ->missing('page.filters')
            ->missing('page.plansView')
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.state', 'ready')
                ->where('window_chat_conversation.data.sessions.0.id', (string) $this->session->id)
                ->where('window_chat_conversation.data.sessions.0.agentName', 'Builder')
                ->missing('window_chat_conversation.data.conversation')));
    }

    public function test_the_rules_window_reads_its_own_search_and_page_beside_the_plans_window(): void
    {
        Rule::query()->create(['text' => 'Every phase ends with its tests.']);
        Rule::query()->create(['text' => 'Write all code in plain English.']);

        $this->actingAs($this->owner)->get('/?window[plans.list][q]=release&rules_q=phase')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.rules.filters.q', 'phase')
            ->where('page.rules.pagination.total', 1)
            ->where('page.rules.rows.0.text', 'Every phase ends with its tests.')
            ->missing('page.rulesView'));
    }

    public function test_a_sent_message_keeps_its_indentation_and_returns_to_the_conversation(): void
    {
        $body = "  Please check:\n    - the indented line\n\nthen answer.  \n";

        $home = route('home', ['window' => ['chat.conversation' => ['session' => (string) $this->session->id]], 'session' => (string) $this->session->id], false);

        $this->actingAs($this->owner)->post('/chat/messages', ['body' => $body, 'session' => (string) $this->session->id])
            ->assertStatus(303)
            ->assertRedirect($home);

        $this->assertSame([$body], Message::query()->ownedBy($this->session->agent_id)->pluck('body')->all());
        $this->actingAs($this->owner)->get($home)->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.id', "{$this->session->agent_id}-{$this->session->id}")
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

    public function test_a_blank_message_is_refused_on_its_body(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/chat/messages', ['body' => "  \n\t ", 'session' => (string) $this->session->id])
            ->assertRedirect('/')
            ->assertSessionHasErrors('body');

        $this->assertSame(0, Message::query()->ownedBy($this->session->agent_id)->count());
    }

    public function test_a_guessed_session_is_refused_on_the_session(): void
    {
        $this->actingAs($this->owner)->from('/')->post('/chat/messages', ['body' => 'Hello', 'session' => (string) ($this->session->id + 100)])
            ->assertRedirect('/')
            ->assertSessionHasErrors('session');
    }
}
