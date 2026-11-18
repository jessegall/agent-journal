<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * The Tasks commands on the bus (doc 19, phase 4): finish, block and cancel announce their change once it committed,
 * a task nobody has is refused with nothing written, and a start needs a session the actor may see.
 */
final class TaskCommandsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits the Tasks commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['tasks', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'links'];

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([TaskFinished::class, TaskBlocked::class, TaskCancelled::class]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
    }

    public function test_finish_block_and_cancel_each_announce_their_change_once(): void
    {
        $bus = $this->app->make(CommandBus::class);
        [$finished, $blocked, $cancelled] = [$this->task('Finish'), $this->task('Block'), $this->task('Cancel')];

        $bus->run(new FinishTask($finished->id));
        $bus->run(new BlockTask($blocked->id));
        $bus->run(new CancelTask($cancelled->id));

        $this->assertSame([TaskState::Finished, TaskState::Blocked, TaskState::Cancelled], [$finished->fresh()?->state, $blocked->fresh()?->state, $cancelled->fresh()?->state]);
        Event::assertDispatchedTimes(TaskFinished::class, 1);
        Event::assertDispatchedTimes(TaskBlocked::class, 1);
        Event::assertDispatchedTimes(TaskCancelled::class, 1);
    }

    public function test_a_task_nobody_has_is_refused_and_nothing_is_announced(): void
    {
        $this->expectExceptionObject(TaskMissing::forId(TestIds::of(999999)));

        try {
            $this->app->make(CommandBus::class)->run(new FinishTask(TestIds::of(999999)));
        } finally {
            Event::assertNotDispatched(TaskFinished::class);
        }
    }

    public function test_a_start_for_a_session_the_actor_may_not_see_is_refused_and_the_task_stays_unstarted(): void
    {
        $task = $this->task('Start');
        $session = $this->app->make(LaunchSessions::class)->launch(Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.main_ready']), 'claude-code')->session;

        try {
            $this->app->make(CommandBus::class)->run(new StartTask($task->id, TestIds::of(999999)));
            $this->fail('A start reached a session nobody may see.');
        } catch (StackTargetRefused) {
            $this->assertNotSame(TaskState::Started, $task->fresh()?->state);
        }
    }

    private function task(string $title): Task
    {
        return Task::query()->create(['title' => $title]);
    }
}
