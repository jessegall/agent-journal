<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\RequestKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\OpensPairChats;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * A source the user docked in a conversation shows above the composer as its card, and nothing is docked until the
 * user docks it.
 */
final class DockSectionTest extends TestCase
{
    use CommitsHookRows;
    use OpensPairChats;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'messages',
        'links',
        'tasks',
        'dock_placements',
    ];

    /**
     * Chat with Tasks beside it, since a task is what these tests dock.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, TasksDomain::class);
    }

    public function test_a_docked_task_shows_as_its_card_in_that_conversation(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->journal->idleAgent('Builder')
            ->startSession('Builder', 'Builder')
            ->sessionCalled('Builder');
        $this->inboxOf(ActorIdentity::of($owner));
        $this->inboxOf(ActorIdentity::ofClass(Agent::class, $session->agent_id));
        $task = Task::factory()->create(['title' => 'Ship the dock']);
        $window = ConversationRequest::queryFor($session->agent_id);

        $this->assertSame([], $this->dockedTitles($owner, $window));

        $this->startUserRequestAs($owner->id);
        $inbox = $this->app->make(DockRequests::class)->inboxWith($session->agent_id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $this->app->make(CommandBus::class)->run(
            new DockSourceCommand($inbox->id, 'tasks.task', $task->id),
        );

        $this->assertSame(['Ship the dock'], $this->dockedTitles($owner, $window));
    }

    public function test_a_message_docked_from_its_row_answers_added_then_present_and_shows_its_first_line(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $session = $this->journal->idleAgent('Builder')
            ->startSession('Builder', 'Builder')
            ->sessionCalled('Builder');

        $message = $this->postTo($this->inboxOf(ActorIdentity::of($owner)), $owner, "Build ready\nAll checks passed.");

        $inboxId = $this->pairChat(
            ActorIdentity::of($owner),
            ActorIdentity::ofClass(Agent::class, $session->agent_id),
        )->id;

        $dock = ['inboxId' => $inboxId, 'type' => Message::linkType(), 'id' => $message->id];

        $this->actingAs($owner)->postJson('/chat/dock', $dock)->assertSuccessful()->assertJson(['outcome' => 'added']);
        $again = $this->actingAs($owner)->postJson('/chat/dock', $dock);
        $again->assertSuccessful()->assertJson(['outcome' => 'present']);

        $query = ConversationRequest::queryFor($session->agent_id);
        $this->assertSame(['Build ready'], $this->dockedTitles($owner, $query));
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
