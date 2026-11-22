<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\HoldingRules;
use Tests\Support\TestIds;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Home: the chat with a chosen agent beside the plans slice, and the composer's send.
 */
final class HomePageTest extends TestCase
{
    use CommitsHookRows;
    use WritesInboxMessages;

    private const string PRIVATE_BODY = 'Private words';

    private const string NO_STORE_HEADER = 'no-store, private';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
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
        $agent = Agent::create('Builder', 'main-agent');
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
        $this->pairId = $ownInboxId.'-'.$this->inboxOf(ActorIdentity::of($agent))->inboxId();
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
            ->where('page.data.windows.3.paneKey', 'rules')
            ->where('page.data.barSections.0.propName', 'section_web_bar_accounts_notices')
            ->where('page.data.barSections.1.propName', 'section_web_bar_chat_agent')
            ->missing('window_chat_conversation')
            ->missing('page.data.plans')
            ->missing('page.data.chat')
            ->reloadOnly('window_plans_list', fn (AssertableInertia $reload) => $reload
                ->where('window_plans_list.data.filters.q', 'release')
                ->where('window_plans_list.data.pagination.total', 1))
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.state', 'ready')
                ->where('window_chat_conversation.data.agents.0.id', $this->session->agent_id)
                ->where('window_chat_conversation.data.agents.0.name', 'Builder')
                ->where('window_chat_conversation.data.agents.0.actions', ['switch'])
                ->where('window_chat_conversation.data.setupRequired', true)
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
                ->where('window_plans_list.data.filters.q', 'release')
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

        $this->actingAs($this->owner)->post(
            '/chat/messages',
            [...$this->pair(), 'body' => $body, ...$this->seenSession()],
        )
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
        $guessed = [...$this->pair(), 'destinationInboxId' => TestIds::of(99999)];

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
        $guessed = [...$this->pair(), 'destinationInboxId' => TestIds::of(99999), 'body' => 'Hello'];

        $this->actingAs($this->owner)->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(403)
            ->assertJson(['code' => 'inbox-unavailable']);
        $this->app['auth']->forgetGuards();
        $this->postJson('/chat/messages', [...$guessed, ...$this->seenSession()])
            ->assertStatus(401)
            ->assertJson(['code' => 'signed-out']);
    }

    public function test_a_repeated_request_key_answers_the_first_message_and_writes_no_second_row(): void
    {
        $send = [...$this->pair(), 'body' => 'Hello once', ...$this->seenSession()];

        $first = $this->keyedSend('key-1', $send)->assertOk()->assertJson(['requestKey' => 'key-1']);
        $first = $first->json('messageId');
        $again = $this->keyedSend('key-1', $send)->assertOk()->json('messageId');

        $this->assertSame($first, $again);
        $this->assertSame(1, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_two_keys_with_the_same_text_make_two_messages(): void
    {
        $send = [...$this->pair(), 'body' => 'Hello twice', ...$this->seenSession()];

        $this->keyedSend('key-1', $send)->assertOk();
        $this->keyedSend('key-2', $send)->assertOk();

        $this->assertSame(2, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_used_key_with_other_text_is_refused_as_a_key_conflict(): void
    {
        $this->keyedSend('key-1', [...$this->pair(), 'body' => 'First text', ...$this->seenSession()])->assertOk();

        $this->keyedSend('key-1', [...$this->pair(), 'body' => 'Other text', ...$this->seenSession()])
            ->assertStatus(409)
            ->assertJson(['code' => 'request-key-conflict']);
        $this->assertSame(1, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_send_to_a_session_that_changed_before_it_ran_is_refused_with_no_row_and_its_key_free(): void
    {
        $stale = [...$this->pair(), 'body' => 'Still there?', ...$this->seenSession(), 'expectedGeneration' => 99];

        $this->keyedSend('key-1', $stale)->assertStatus(409)->assertJson(['code' => 'stale-generation']);
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());

        $this->keyedSend('key-2', [...$stale, ...$this->seenSession()])->assertOk();
        $this->assertSame(1, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_caller_who_no_longer_sees_the_message_gets_neither_text_nor_id_on_a_repeat(): void
    {
        $send = [...$this->pair(), 'body' => 'Private words', ...$this->seenSession()];
        $messageId = $this->keyedSend('key-1', $send)->assertOk()->json('messageId');
        Message::query()->withoutGlobalScopes()->whereKey($messageId)->delete();

        $answer = $this->keyedSend('key-1', $send);

        $answer->assertStatus(403);
        $this->assertStringNotContainsString($messageId, (string) $answer->getContent());
        $this->assertStringNotContainsString(self::PRIVATE_BODY, (string) $answer->getContent());
    }

    public function test_a_confirmed_send_is_looked_up_by_its_key_with_its_id_and_never_cached(): void
    {
        $send = [...$this->pair(), 'body' => 'Hi', ...$this->seenSession()];
        $messageId = $this->keyedSend('key-1', $send)->json('messageId');

        $this->outcomeOf('key-1')
            ->assertOk()
            ->assertHeader('Cache-Control', self::NO_STORE_HEADER)
            ->assertExactJson(['outcome' => 'confirmed', 'messageId' => $messageId]);
    }

    public function test_an_unknown_key_or_another_target_is_not_yet_observable_and_reveals_nothing(): void
    {
        $this->keyedSend('key-1', [...$this->pair(), 'body' => 'Hi', ...$this->seenSession()])->assertOk();

        $this->outcomeOf('key-2')->assertExactJson(['outcome' => 'not-yet-observable']);
        $this->outcomeOf('key-1', ['destinationInboxId' => TestIds::of(99999)])
            ->assertExactJson(['outcome' => 'not-yet-observable']);
        $this->outcomeOf('key-1', ['operation' => 'reply', 'messageId' => TestIds::of(99999)])
            ->assertExactJson(['outcome' => 'not-yet-observable']);
    }

    public function test_an_expired_receipt_is_expired_and_a_recorded_refusal_is_refused_with_its_code(): void
    {
        $this->keyedSend('key-1', [...$this->pair(), 'body' => 'Hi', ...$this->seenSession()])->assertOk();
        $this->keyedSend('key-2', [...$this->pair(), 'body' => 'Hello', ...$this->seenSession()])->assertOk();
        DB::table('command_receipts')->where('request_key', 'key-1')->update(['answers_until' => now()->subMinute()]);
        DB::table('command_receipts')->where('request_key', 'key-2')->update([
            'state' => 'refused',
            'refusal_code' => 'conflict',
            'refusal_message' => 'The conversation changed.',
        ]);

        $this->outcomeOf('key-1')->assertExactJson(['outcome' => 'expired']);
        $this->outcomeOf('key-2')->assertExactJson([
            'outcome' => 'refused',
            'code' => 'conflict',
            'message' => 'The conversation changed.',
        ]);
    }

    public function test_a_caller_who_lost_sight_of_the_message_is_told_it_is_no_longer_visible_without_its_id(): void
    {
        $send = [...$this->pair(), 'body' => 'Hi', ...$this->seenSession()];
        $messageId = $this->keyedSend('key-1', $send)->json('messageId');
        Message::query()->withoutGlobalScopes()->whereKey($messageId)->delete();

        $this->outcomeOf('key-1')->assertExactJson(['outcome' => 'no-longer-visible']);
    }

    /**
     * @param  array<string, string>  $changes
     */
    private function outcomeOf(string $key, array $changes = []): TestResponse
    {
        $query = http_build_query(['requestKey' => $key, 'operation' => 'send', ...$this->pair(), ...$changes]);

        return $this->actingAs($this->owner)->getJson("/chat/messages/outcome?{$query}");
    }

    /**
     * @param  array<string, mixed>  $send
     */
    private function keyedSend(string $key, array $send): TestResponse
    {
        return $this->actingAs($this->owner)
            ->withHeader('Idempotency-Key', $key)
            ->postJson('/chat/messages', $send);
    }

    /**
     * @return array{sourceInboxId: string, destinationInboxId: string}
     */
    private function pair(): array
    {
        [$sourceInboxId, $destinationInboxId] = explode('-', $this->pairId);

        return ['sourceInboxId' => $sourceInboxId, 'destinationInboxId' => $destinationInboxId];
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
            'expectedGeneration' => AgentRuntime::ofSession($this->session->id)?->process_generation ?? 0,
        ];
    }
}
