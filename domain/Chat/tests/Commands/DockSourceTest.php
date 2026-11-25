<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\RequestKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;

/**
 * A user docks a source in a conversation once: a second dock of it answers the placement it has, and an agent the
 * user cannot see or a conversation the user takes no part in is refused before anything is docked.
 */
final class DockSourceTest extends TestCase
{
    use CommitsHookRows;

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
        'links',
        'tasks',
        'dock_placements',
    ];

    private User $owner;

    private string $agentId;

    private string $conversationId;

    private Task $task;

    /**
     * Chat with Tasks beside it, since a task is what these tests dock.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, TasksDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();
        $this->agentId = $this->journal->idleAgent('Builder')
            ->startSession('Builder', 'Builder')
            ->sessionCalled('Builder')->agent_id;
        $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->owner),
            ActorIdentity::ofClass(Agent::class, $this->agentId),
        );
        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
        $this->journal->actAsUserId($this->owner->id);
        $this->conversationId = $this->app->make(DockRequests::class)->inboxWith($this->agentId)->id;
    }

    public function test_a_second_dock_of_one_source_answers_its_one_placement(): void
    {
        $added = $this->runKeyed($this->dockTask(), (string) Str::ulid());
        $present = $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $this->assertSame([
            DockOutcome::Added,
            DockOutcome::Present,
        ], [
            $added->outcome,
            $present->outcome,
        ]);
        $this->assertSame($added->placementId, $present->placementId);
        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_an_agent_out_of_sight_is_refused_before_anything_is_docked(): void
    {
        $this->expectException(ChatUnavailable::class);

        try {
            $this->app->make(DockRequests::class)->inboxWith(strtolower((string) Str::ulid()));
        } finally {
            $this->assertSame(0, DockPlacement::query()->count());
        }
    }

    public function test_a_conversation_the_user_takes_no_part_in_is_refused(): void
    {
        $strangers = $this->journal->inboxes()->pairChat(
            ActorIdentity::ofClass(Agent::class, 'agent-one'),
            ActorIdentity::ofClass(Agent::class, 'agent-two'),
        );

        $this->expectException(ChatUnavailable::class);

        $this->runKeyed(
            new DockSourceCommand($strangers->id, 'tasks.task', $this->task->id),
            (string) Str::ulid(),
        );
    }

    private function dockTask(): DockSourceCommand
    {
        return new DockSourceCommand($this->conversationId, 'tasks.task', $this->task->id);
    }

    /**
     * @param  Command<DockResult>  $command
     */
    private function runKeyed(Command $command, string $key): DockResult
    {
        $this->journal->actAsUserId($this->owner->id);
        $this->app->make(RequestKey::class)->set($key);

        try {
            return $this->app->make(CommandBus::class)->run($command);
        } finally {
            $this->app->make(RequestKey::class)->forget();
        }
    }
}
