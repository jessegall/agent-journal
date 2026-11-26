<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
use App\Support\Command;
use App\Support\RequestKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Commands\UndockSource\UndockSourceCommand;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A user undocks a placement: undocking on chat's own page returns there, a retried dock under the first key answers
 * the first time even after the placement is gone, and a guessed placement is nothing to act on.
 */
#[TestsCommand(UndockSourceCommand::class)]
final class UndockSourceTest extends TestCase
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

        $this->journal->fixtures(ChatFixtures::class)->pairChat(
            ActorReference::of($this->owner),
            ActorReference::ofClass(Agent::class, $this->agentId),
        );

        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
        $this->journal->actAsUserId($this->owner->id);
        $this->conversationId = $this->app->make(DockRequests::class)->inboxWith($this->agentId)->id;
    }

    public function test_a_retried_dock_after_its_removal_answers_the_first_time_and_docks_nothing(): void
    {
        $key = (string) Str::ulid();
        $added = $this->runKeyed($this->dockTask(), $key);

        $this->runKeyed(
            new UndockSourceCommand($this->conversationId, (string) $added->placementId, 'tasks.task', $this->task->id),
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
            new UndockSourceCommand(
                $this->conversationId,
                strtolower((string) Str::ulid()),
                'tasks.task',
                $this->task->id,
            ),
            (string) Str::ulid(),
        );

        $this->assertEquals(DockResult::unavailable(), $guessed);
        $this->assertSame(1, DockPlacement::query()->count());
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
