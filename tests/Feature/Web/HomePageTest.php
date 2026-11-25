<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Support\StartSessions;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\OpensPairChats;
use Tests\Support\TestIds;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;
    use OpensPairChats;
    use WritesInboxMessages;

    private const string PRIVATE_BODY = 'Private words';

    private const string NO_STORE_HEADER = 'no-store, private';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'messages',
        'links',
        'plans',
        'rules',
        'inboxes', 'inbox_members',
        'assignments',
        'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    private string $chatInboxId;

    private int $sends = 0;

    private User $owner;

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::create('Builder', 'main-agent', $this->localProject());
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->chatInboxId = $this->pairChat(ActorIdentity::of($this->owner), ActorIdentity::of($agent))->id;
        Plan::factory()->create(['title' => 'Build the release page', 'type' => PlanType::Build]);
    }

    public function test_a_guest_is_sent_to_sign_in(): void
    {
        $this->get('/')->assertRedirect('/login');
    }

    public function test_home_shows_the_agents_and_the_same_plans_slice_as_the_plans_page(): void
    {
        $this->actingAs(
            $this->owner,
        )->get('/?window[plans.list][q]=release&q=elsewhere')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('web/Home')
            ->where('page.data.windows.0.paneKey', 'chat')
            ->where('page.data.windows.1.paneKey', 'plans')
            ->where('page.data.windows.2.paneKey', 'tasks')
            ->where('page.data.windows.3.paneKey', 'web.asks')
            ->where('page.data.windows.4.paneKey', 'documents')
            ->where('page.data.windows.5.paneKey', 'helpers')
            ->where('page.data.windows.6.paneKey', 'reminders')
            ->where('page.data.windows.7.paneKey', 'rules')
            ->where('page.data.barSections.0.propName', 'section_web_bar_accounts_notices')
            ->where('page.data.barSections.1.propName', 'section_web_bar_chat_agent')
            ->missing('window_chat_conversation')
            ->missing('page.data.plans')
            ->missing('page.data.chat')
            ->reloadOnly('window_plans_list', fn (AssertableInertia $reload) => $reload
                ->where('window_plans_list.data.root.children.0.children.1.text', '1'))
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.state', 'ready')
                ->where('window_chat_conversation.data.agents.0.id', $this->session->agent_id)
                ->where('window_chat_conversation.data.agents.0.name', 'Builder')
                ->where('window_chat_conversation.data.agents.0.actions', ['switch'])
                ->where('window_chat_conversation.data.isSetupRequired', true)
                ->missing('window_chat_conversation.data.conversation')));
    }

    public function test_the_rules_window_reads_its_own_search_and_page_beside_the_plans_window(): void
    {
        HoldingRules::create('Every phase ends with its tests.');
        HoldingRules::create('Write all code in plain English.');

        $this->actingAs(
            $this->owner,
        )->get('/?window[plans.list][q]=release&window[rules.list][q]=phase')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->missing('page.data.rules')
            ->reloadOnly(['window_plans_list', 'window_rules_list'], fn (AssertableInertia $reload) => $reload
                ->where('window_rules_list.data.root.children.0.children.1.field.value', 'phase')
                ->where('window_rules_list.data.root.children.0.children.0.text', 'Rules (1)')
                ->where('window_rules_list.data.root.children.1.children.0.children.0.text', 'No rules awaiting review')
                ->where(
                    'window_rules_list.data.root.children.1.children.0.children.1.rows.0.label',
                    'Every phase ends with its tests.',
                )));
    }

    public function test_a_sent_message_keeps_its_indentation_and_returns_to_the_conversation(): void
    {
        $body = <<<'TEXT'
          Please check:
            - the indented line

        then answer.  

        TEXT;

        $home = route(
            'home',
            ConversationRequest::queryFor($this->session->agent_id),
            false,
        );

        $this->actingAs($this->owner)->from($home)->post(
            '/chat/messages',
            [...$this->pair(), 'body' => $body, ...$this->seenSession()],
        )
            ->assertStatus(303)
            ->assertRedirect($home);

        $this->assertSame([$body], Message::query()->withoutGlobalScopes()->pluck('body')->all());
        $this->actingAs($this->owner)->get($home)->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.inboxId', $this->chatInboxId)
                ->where('window_chat_conversation.data.conversation.sessionId', (string) $this->session->id)));
    }

    public function test_the_chat_window_is_also_chats_own_page(): void
    {
        $this->actingAs($this->owner)->get(
            "/chat?agent={$this->session->agent_id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('chat/ChatWindow')
            ->where('page.state', 'ready')
            ->where('page.data.agents.0.name', 'Builder')
            ->where('page.data.conversation.agentId', $this->session->agent_id)
            ->where('page.data.conversation.sessionId', (string) $this->session->id));
    }

    public function test_chats_dock_shows_the_plans_waiting_for_review_beside_the_chosen_session(): void
    {
        $waiting = Plan::factory()->create(['title' => 'Review the dock', 'type' => PlanType::Build]);
        Plan::query()->whereKey($waiting->id)->update(['state' => PlanState::Reviewing->value]);

        $this->actingAs($this->owner)->get(
            "/chat?session={$this->session->id}",
        )->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_chat_dock_plans_waiting', fn (AssertableInertia $section) => $section
                ->where('section_chat_dock_plans_waiting.state', 'ready')
                ->where('section_chat_dock_plans_waiting.data.root.children.0.rows.0.label', "plan {$waiting->number} · Review the dock")));
        $this->actingAs($this->owner)->get('/chat')->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_chat_dock_plans_waiting', fn (AssertableInertia $section) => $section
                ->where('section_chat_dock_plans_waiting', null)));
    }

    public function test_homes_bar_names_the_chosen_agent_through_chats_section(): void
    {
        $this->actingAs($this->owner)->get(
            "/?agent={$this->session->agent_id}",
        )->assertInertia(fn (AssertableInertia $page) => $page
            ->loadDeferredProps('section_web_bar_chat_agent', fn (AssertableInertia $section) => $section
                ->where('section_web_bar_chat_agent.state', 'ready')
                ->where('section_web_bar_chat_agent.data.selectedAgentId', $this->session->agent_id)
                ->where('section_web_bar_chat_agent.data.agents.0.name', 'Builder')));
    }

    public function test_a_blank_message_is_refused_on_its_body(): void
    {
        $this->actingAs($this->owner)->from('/')->post(
            '/chat/messages',
            [...$this->pair(), 'body' => "  \n\t ", ...$this->seenSession()],
        )
            ->assertRedirect('/')
            ->assertSessionHasErrors('body');

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_message_written_for_a_session_the_agent_no_longer_runs_is_not_delivered(): void
    {
        $outdated = [...$this->seenSession(), 'expectedSessionId' => strtolower((string) Str::ulid())];

        $this->actingAs($this->owner)->from('/')
            ->post('/chat/messages', [...$this->pair(), 'body' => 'Still there?', ...$outdated])
            ->assertRedirect('/')
            ->assertSessionHasErrors(['session' => 'The agent now runs another session. Send the message again to reach it.']);
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_guessed_destination_inbox_is_refused_and_leaves_no_message(): void
    {
        $guessed = [...$this->pair(), 'inboxId' => TestIds::of(99999)];

        $this->actingAs($this->owner)->from('/')
            ->post('/chat/messages', [...$guessed, 'body' => 'Hello', ...$this->seenSession()])
            ->assertRedirect('/')
            ->assertSessionHasErrors('command');
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_stale_send_answers_json_with_409_and_its_code_and_flashes_the_code_to_a_form(): void
    {
        $outdated = [...$this->pair(), 'body' => 'Still there?', ...$this->seenSession(), 'expectedGeneration' => 99];

        $this->actingAs($this->owner)->postJson('/chat/messages', $outdated)
            ->assertStatus(409)
            ->assertJson(['code' => 'stale-generation']);
        $this->actingAs($this->owner)->from('/')->post('/chat/messages', $outdated)
            ->assertRedirect('/')
            ->assertSessionHasErrors('session')
            ->assertSessionHas('refusal_code', 'stale-generation');
    }

    public function test_refused_input_answers_json_with_422_and_its_fields(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/chat/messages', [...$this->pair(), 'body' => '  ', ...$this->seenSession()])
            ->assertStatus(422)
            ->assertJson(['code' => 'invalid-input'])
            ->assertJsonStructure(['message', 'fields' => ['body']]);
    }

    public function test_a_denied_target_answers_json_with_403_and_an_expired_sign_in_with_401(): void
    {
        $guessed = [...$this->pair(), 'inboxId' => TestIds::of(99999), 'body' => 'Hello'];

        $this->actingAs($this->owner)->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(403)
            ->assertJson(['code' => 'inbox-unavailable']);
        $this->app['auth']->forgetGuards();
        $this->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(401)
            ->assertJson(['code' => 'signed-out']);
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function outcomeOf(string $key, array $changes = []): TestResponse
    {
        $query = http_build_query([
            'operation' => 'send',
            'inboxId' => $this->chatInboxId,
            'requestKey' => $key,
            ...$changes,
        ]);

        return $this->actingAs($this->owner)->getJson("/chat/messages/outcome?{$query}");
    }

    /**
     * @param  array<string, mixed>  $send
     */
    private function keyedSend(string $key, array $send): TestResponse
    {
        return $this->actingAs($this->owner)
            ->from('/')
            ->withHeader('Idempotency-Key', $key)
            ->post('/chat/messages', [...$send, 'requestKey' => $key]);
    }

    /**
     * The pair's chat inbox and a request key of the send's own.
     *
     * @return array{inboxId: string, requestKey: string}
     */
    private function pair(): array
    {
        return ['inboxId' => $this->chatInboxId, 'requestKey' => 'home-send-'.++$this->sends];
    }

    /**
     * The agent a send goes to and the session the sender saw it run.
     *
     * @return array{agent: string, expectedSessionId: string, expectedGeneration: int}
     */
    private function seenSession(): array
    {
        return [
            'agent' => $this->session->agent_id,
            'expectedSessionId' => $this->session->id,
            'expectedGeneration' => AgentRuntime::findForSession($this->session->id)?->process_generation ?? 0,
        ];
    }
}
