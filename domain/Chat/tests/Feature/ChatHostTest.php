<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * Chat asks from the user's own inbox to the chosen agent's inbox and shows the exchange between those two
 * inboxes, so Core's messages are the conversation Chat displays.
 */
final class ChatHostTest extends TestCase
{
    use CommitsHookRows;
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
        $ownInboxId = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $agentInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $session->agent_id))->inboxId();
        $window = ['window' => ['chat.conversation' => ['session' => $session->id]], 'session' => $session->id];

        $this->actingAs($owner)
            ->post('/chat/messages', [
                'sourceInboxId' => $ownInboxId,
                'destinationInboxId' => $agentInboxId,
                'body' => 'Is the build green?',
                'session' => $session->id,
            ])
            ->assertRedirect(route('home', $window, false));

        $message = Message::query()->withoutGlobalScopes()->sole();
        $this->assertSame($ownInboxId, $message->source_inbox_id);
        $this->assertSame($agentInboxId, $message->destination_inbox_id);
        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.id', "{$ownInboxId}-{$agentInboxId}")
                ->where('window_chat_conversation.data.conversation.messages.0.body', 'Is the build green?')));
    }
}
