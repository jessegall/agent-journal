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
use Illuminate\Support\Str;
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
            ->where('page.data.windows.2.paneKey', 'rules')
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
                ->where('window_rules_list.data.filters.q', 'phase')
                ->where('window_rules_list.data.pagination.total', 1)
                ->where('window_rules_list.data.rows.0.text', 'Every phase ends with its tests.')));
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
                ->where('section_chat_dock_plans_waiting.data.rows.0.title', 'Review the dock')));
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
