<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\AskMessage;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
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

    public function test_reading_marks_only_the_shown_incoming_messages(): void
    {
        $shown = $this->agentAsks('Shown?');
        $notShown = $this->agentAsks('Not shown yet?');

        $this->actingAs($this->owner)
            ->post('/chat/messages/read', [
                'inboxId' => $this->ownInboxId,
                'messageIds' => [$shown],
                'session' => $this->session->id,
            ])
            ->assertRedirect();

        $this->assertNotNull($this->stored($shown)->read_at);
        $this->assertNull($this->stored($notShown)->read_at);
    }

    public function test_a_reply_to_a_message_that_changed_is_refused_and_writes_nothing(): void
    {
        $questionId = $this->agentAsks('Which port?');
        $shownVersion = $this->stored($questionId)->state_version;
        $this->actingAs($this->owner)->post('/chat/messages/reply', [
            'messageId' => $questionId,
            'stateVersion' => $shownVersion,
            'body' => 'Port 80.',
            'session' => $this->session->id,
        ]);

        $this->actingAs($this->owner)->from('/')
            ->post('/chat/messages/reply', [
                'messageId' => $questionId,
                'stateVersion' => $shownVersion,
                'body' => 'Port 8080.',
                'session' => $this->session->id,
            ])
            ->assertConflict();

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
