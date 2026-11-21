<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * A source the user docked in a conversation shows above the composer as its card, and nothing is docked until the
 * user docks it.
 */
final class DockSectionTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
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
        'tasks',
        'conversations',
        'dock_placements',
    ];

    public function test_a_docked_task_shows_as_its_card_in_that_conversation(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->startedMainAgentSession();
        $this->inboxOf(ActorIdentity::of($owner));
        $this->inboxOf(new ActorIdentity(ActorType::Agent, $session->agent_id));
        $task = Task::factory()->create(['title' => 'Ship the dock']);
        $window = ConversationRequest::queryFor($session->agent_id);

        $this->assertSame([], $this->dockedTitles($owner, $window));

        $this->startUserRequestAs($owner->id);
        $conversation = $this->app->make(DockRequests::class)->conversationWith($session->agent_id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(
            new DockSource($conversation->id, 'tasks.task', $task->id),
        );

        $this->assertSame(['Ship the dock'], $this->dockedTitles($owner, $window));
    }

    public function test_a_message_docked_from_its_row_answers_added_then_present_and_shows_its_first_line(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->startedMainAgentSession();
        $message = $this->askBetween(
            $this->inboxOf(ActorIdentity::of($owner)),
            $this->inboxOf(new ActorIdentity(ActorType::Agent, $session->agent_id)),
            "Build ready\nAll checks passed.",
        );
        $dock = ['agent' => $session->agent_id, 'type' => Message::LINK_TYPE, 'id' => $message->id];

        $this->actingAs($owner)->postJson('/chat/dock', $dock)->assertSuccessful()->assertJson(['outcome' => 'added']);
        $again = $this->actingAs($owner)->postJson('/chat/dock', $dock);
        $again->assertSuccessful()->assertJson(['outcome' => 'present']);

        $query = ConversationRequest::queryFor($session->agent_id);
        $this->assertSame(['Build ready…'], $this->dockedTitles($owner, $query));
    }

    /**
     * @param  array<string, mixed>  $window
     * @return list<string>
     */
    private function dockedTitles(User $owner, array $window): array
    {
        $titles = [];

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(
            function (AssertableInertia $page) use (&$titles): AssertableInertia {
                $read = function (AssertableInertia $reload) use (&$titles): AssertableInertia {
                    $conversation = $reload->toArray()['props']['window_chat_conversation']['data']['conversation'];
                    $titles = array_column($conversation['dock']['cards'], 'accessibleName');

                    return $reload;
                };

                return $page->reloadOnly('window_chat_conversation', $read);
            },
        );

        return $titles;
    }
}
