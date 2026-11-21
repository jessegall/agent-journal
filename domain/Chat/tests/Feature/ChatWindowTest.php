<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\MainAgentDesignation;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\AskMessage;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * Chat reads only the incoming messages a user was shown, for everyone at the inbox, and a reply to a message that
 * changed since it was shown is refused without writing anything.
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
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
        'main_agent_designations',
        'driver_switches',
        'driver_conversations',
    ];

    private User $owner;

    private AgentSession $session;

    private string $ownInboxId;

    private string $agentInboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agent = Agent::create('Builder', 'main-agent');

        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $this->ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->inboxId();
        $this->agentInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $agent->id))->inboxId();
    }

    public function test_home_selects_the_idle_main_agent_and_offers_a_headless_helper_no_terminal(): void
    {
        $main = Agent::create('Main agent', 'main-agent');
        MainAgentDesignation::create($main);

        $this->askBetween(
            $this->inboxOf(ActorIdentity::of($this->owner)),
            $this->inboxOf(new ActorIdentity(ActorType::Agent, $main->id)),
            'Done for today.',
        );

        $this->actingAs($this->owner)->get('/chat')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.setupRequired', false)
            ->where('page.data.selectedAgentId', $main->id)
            ->where('page.data.conversation.agentId', $main->id)
            ->where('page.data.conversation.sessionId', null)
            ->where('page.data.conversation.messages.0.body', 'Done for today.')
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
                ->where('page.state', 'failed')
                ->missing('page.data.conversation'));
    }

    public function test_reading_marks_only_the_shown_incoming_messages(): void
    {
        $shown = $this->agentAsks('Shown?');
        $notShown = $this->agentAsks('Not shown yet?');

        $this->actingAs($this->owner)
            ->post('/chat/messages/read', [
                'inboxId' => $this->ownInboxId,
                'messageIds' => [$shown],
                'agent' => $this->session->agent_id,
            ])
            ->assertRedirect();

        $this->assertNotNull($this->stored($shown)->read_at);
        $this->assertNull($this->stored($notShown)->read_at);
    }

    public function test_reading_on_chats_own_page_returns_to_that_page(): void
    {
        $shown = $this->agentAsks('Shown?');
        $chat = '/chat?agent='.$this->session->agent_id;

        $this->actingAs($this->owner)
            ->from($chat)
            ->post('/chat/messages/read', [
                'inboxId' => $this->ownInboxId,
                'messageIds' => [$shown],
                'agent' => $this->session->agent_id,
            ])
            ->assertRedirect($chat);
    }

    public function test_a_reply_to_a_message_that_changed_is_refused_and_writes_nothing(): void
    {
        $questionId = $this->agentAsks('Which port?');
        $shownVersion = $this->stored($questionId)->state_version;

        $this->actingAs($this->owner)->post('/chat/messages/reply', [
            'messageId' => $questionId,
            'stateVersion' => $shownVersion,
            'body' => 'Port 80.',
            'agent' => $this->session->agent_id,
        ]);

        $this->actingAs($this->owner)->from('/')
            ->post('/chat/messages/reply', [
                'messageId' => $questionId,
                'stateVersion' => $shownVersion,
                'body' => 'Port 8080.',
                'agent' => $this->session->agent_id,
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors('command')
            ->assertSessionHas('refusal_code', 'stale-version');

        $this->assertSame(2, Message::query()->withoutGlobalScopes()->count());
    }

    private function agentAsks(string $body): string
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->session->agent_id, $this->session->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(new AskMessage($this->agentInboxId, $this->ownInboxId, $body));
    }

    private function stored(string $messageId): Message
    {
        return Message::query()->withoutGlobalScopes()->findOrFail($messageId);
    }
}
