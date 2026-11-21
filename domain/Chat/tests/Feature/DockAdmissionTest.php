<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\Command;
use App\Bus\Support\RequestKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Commands\DockSource;
use Domain\Chat\Commands\UndockSource;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * Docking goes through one admission: a second dock of one source answers the placement it has, a retry under the
 * first key answers the first time even after the placement is gone, a guessed placement is nothing to act on, and an
 * agent the user cannot see or a conversation the user takes no part in is refused before anything is docked.
 */
final class DockAdmissionTest extends TestCase
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
        'links',
        'tasks',
        'conversations',
        'dock_placements',
    ];

    private User $owner;

    private string $agentId;

    private string $conversationId;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->agentId = $this->startedMainAgentSession()->agent_id;
        $this->inboxOf(ActorIdentity::of($this->owner));
        $this->inboxOf(new ActorIdentity(ActorType::Agent, $this->agentId));
        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
        $this->startUserRequestAs($this->owner->id);
        $this->conversationId = $this->app->make(DockRequests::class)->conversationWith($this->agentId)->id;
    }

    public function test_a_second_dock_of_one_source_answers_its_one_placement(): void
    {
        $added = $this->runKeyed($this->dockTask(), (string) Str::ulid());
        $present = $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $this->assertSame([DockOutcome::Added, DockOutcome::Present], [$added->outcome, $present->outcome]);
        $this->assertSame($added->placementId, $present->placementId);
        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_a_retried_dock_after_its_removal_answers_the_first_time_and_docks_nothing(): void
    {
        $key = (string) Str::ulid();
        $added = $this->runKeyed($this->dockTask(), $key);
        $this->runKeyed(
            new UndockSource($this->conversationId, (string) $added->placementId, 'tasks.task', $this->task->id),
            (string) Str::ulid(),
        );

        $retried = $this->runKeyed($this->dockTask(), $key);

        $this->assertEquals($added, $retried);
        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_a_guessed_placement_is_nothing_to_act_on(): void
    {
        $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $guessed = $this->runKeyed(
            new UndockSource($this->conversationId, strtolower((string) Str::ulid()), 'tasks.task', $this->task->id),
            (string) Str::ulid(),
        );

        $this->assertEquals(DockResult::unavailable(), $guessed);
        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_an_agent_out_of_sight_is_refused_before_anything_is_docked(): void
    {
        $this->expectException(ConversationUnavailable::class);

        try {
            $this->app->make(DockRequests::class)->conversationWith(strtolower((string) Str::ulid()));
        } finally {
            $this->assertSame(0, DockPlacement::query()->count());
        }
    }

    public function test_a_conversation_the_user_takes_no_part_in_is_refused(): void
    {
        $strangers = Conversation::between(
            $this->inboxOf(new ActorIdentity(ActorType::Agent, 'agent-one'))->inboxId(),
            $this->inboxOf(new ActorIdentity(ActorType::Agent, 'agent-two'))->inboxId(),
        );

        $this->expectException(ConversationUnavailable::class);

        $this->runKeyed(new DockSource($strangers->id, 'tasks.task', $this->task->id), (string) Str::ulid());
    }

    private function dockTask(): DockSource
    {
        return new DockSource($this->conversationId, 'tasks.task', $this->task->id);
    }

    /**
     * @param  Command<DockResult>  $command
     */
    private function runKeyed(Command $command, string $key): DockResult
    {
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(RequestKey::class)->set($key);

        try {
            return $this->app->make(CommandBus::class)->run($command);
        } finally {
            $this->app->make(RequestKey::class)->forget();
        }
    }
}
