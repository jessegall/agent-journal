<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Records\Support\RecordIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\DockRecord;
use Domain\Chat\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * A record the user docked in a conversation shows above the composer as its owner's card, and nothing is docked
 * until the user docks it.
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
        'docked_records',
    ];

    public function test_a_docked_task_shows_as_its_owners_card_in_that_conversation(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->startedMainAgentSession();
        $ownInboxId = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $agentInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $session->agent_id))->inboxId();
        $task = Task::factory()->create(['title' => 'Ship the dock']);
        $window = ['window' => ['chat.conversation' => ['session' => $session->id]], 'session' => $session->id];

        $this->assertSame([], $this->dockedTitles($owner, $window));

        $this->startUserRequestAs($owner->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(
            new DockRecord($ownInboxId, $agentInboxId, new RecordIdentity('tasks.task', $task->id)),
        );

        $this->assertSame(['Ship the dock'], $this->dockedTitles($owner, $window));
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
                    $titles = array_column($conversation['dockedCards'], 'title');

                    return $reload;
                };

                return $page->reloadOnly('window_chat_conversation', $read);
            },
        );

        return $titles;
    }
}
