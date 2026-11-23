<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\AskMessage\AskMessageCommand;
use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorInboxResolver;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\Inbox;
use App\Enums\ActorType;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\MainAgentDesignation;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\RequestKey;
use App\Support\StartSessions;
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

        $this->actingAs($this->owner)->get('/chat')->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.setupRequired', false)
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

    public function test_a_missing_own_desk_inbox_no_longer_blocks_the_pair_chat(): void
    {
        $this->app->instance(ActorInboxResolver::class, new class implements ActorInboxResolver
        {
            public function preferredFor(Actor $actor): Inbox
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

    public function test_a_reply_from_the_chat_window_to_desk_mail_is_refused_and_writes_nothing(): void
    {
        $questionId = $this->agentAsks('Which port?');

        $this->actingAs($this->owner)->from('/')
            ->post('/chat/messages/reply', [
                'messageId' => $questionId,
                'stateVersion' => $this->stored($questionId)->state_version,
                'body' => 'Port 80.',
                'agent' => $this->session->agent_id,
                'inboxId' => $this->ownInboxId,
                'requestKey' => 'window-reply-1',
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors('command');

        $this->assertSame(1, Message::query()->withoutGlobalScopes()->count());
    }

    private function agentAsks(string $body): string
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->session->agent_id, $this->session->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run(
            new AskMessageCommand($this->agentInboxId, $this->ownInboxId, $body),
        );
    }

    private function stored(string $messageId): Message
    {
        return Message::query()->withoutGlobalScopes()->findOrFail($messageId);
    }
}
