<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Enums\ActorType;
use App\Models\Agent;
use App\Models\AgentRuntime;
use App\Models\Message;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * Chat asks from the user's own inbox to the chosen agent's inbox and shows the exchange between those two
 * inboxes, so Core's messages are the conversation Chat displays.
 */
final class ChatHostTest extends TestCase
{
    use CommitsHookRows;
    use OpensPairChats;
    use StartsMainAgents;
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

    public function test_a_user_sends_to_the_chosen_agent_and_sees_the_pair_exchange(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->startedMainAgentSession();

        $chatInboxId = $this->pairChat(
            ActorIdentity::of($owner),
            new ActorIdentity(ActorType::Agent, $session->agent_id),
        )->inbox_id;

        $window = ConversationRequest::queryFor($session->agent_id);

        $this->actingAs($owner)
            ->post('/chat/messages', [
                'inboxId' => $chatInboxId,
                'requestKey' => 'host-send-1',
                'body' => 'Is the build green?',
                'agent' => $session->agent_id,
                'expectedSessionId' => $session->id,
                'expectedGeneration' => AgentRuntime::ofSession($session->id)?->process_generation ?? 0,
            ])
            ->assertRedirect(route('home', $window, false));

        $message = Message::query()->withoutGlobalScopes()->sole();
        $this->assertSame($chatInboxId, $message->source_inbox_id);
        $this->assertSame($chatInboxId, $message->destination_inbox_id);

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.inboxId', $chatInboxId)
                ->where('window_chat_conversation.data.conversation.messages.0.body', 'Is the build green?')));
    }
}
