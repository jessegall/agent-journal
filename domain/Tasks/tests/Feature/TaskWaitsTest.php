<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\AddTaskWait;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\RemoveTaskWait;
use Domain\Tasks\Commands\WaiveTaskWait;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A task waits on another through a checked, recorded edge: no self-link and no cycle, a waiver needs a reason and
 * keeps who and when, a cancelled prerequisite leaves the wait outstanding, and the history keeps every change.
 */
final class TaskWaitsTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_waits',
        'task_wait_history',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    private Task $first;

    private Task $second;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = Task::factory()->create(['title' => 'Prepare records']);
        $this->second = Task::factory()->create(['title' => 'Publish records']);
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_a_cycle_and_a_self_link_are_refused(): void
    {
        $this->runCommand(new AddTaskWait($this->second->id, $this->first->id, self::key()));

        $this->assertThrows(
            fn () => $this->runCommand(new AddTaskWait($this->first->id, $this->second->id, self::key())),
            TaskWaitRefused::class,
        );
        $this->assertThrows(
            fn () => $this->runCommand(new AddTaskWait($this->first->id, $this->first->id, self::key())),
            TaskWaitRefused::class,
        );
        $this->assertSame(1, TaskWait::query()->count());
    }

    public function test_a_waiver_needs_a_reason_and_keeps_who_and_when(): void
    {
        $this->runCommand(new AddTaskWait($this->second->id, $this->first->id, self::key()));

        $this->assertThrows(
            fn () => $this->runCommand(new WaiveTaskWait($this->second->id, $this->first->id, self::key(), '')),
        );

        $this->runCommand(new WaiveTaskWait($this->second->id, $this->first->id, self::key(), 'Done by hand.'));

        $wait = TaskWait::between($this->second->id, $this->first->id);
        $this->assertNotNull($wait?->waived_at);
        $this->assertSame([$this->owner->id, 'Done by hand.'], [$wait->waived_by_id, $wait->waive_reason]);
        $this->assertSame([$this->second->id], $this->waits()->readyAmong([$this->second->id]));
    }

    public function test_a_cancelled_prerequisite_leaves_the_wait_outstanding_and_history_keeps_every_change(): void
    {
        $this->runCommand(new AddTaskWait($this->second->id, $this->first->id, self::key()));
        $this->runCommand(new CancelTask($this->first->id, 'Not needed.'));

        $this->assertSame([], $this->waits()->readyAmong([$this->second->id]));
        $waits = $this->waits()->waitsOf($this->second->id);
        $this->assertFalse($waits->waitsFor[0]->isSatisfied);
        $this->assertSame($this->second->id, $this->waits()->waitsOf($this->first->id)->holdsUp[0]->taskId);

        $this->runCommand(new RemoveTaskWait($this->second->id, $this->first->id, self::key()));

        $this->assertSame(
            [TaskWaitChange::Added, TaskWaitChange::Removed],
            TaskWaitHistory::query()->orderBy('created_at')->orderBy('id')->pluck('change')->all(),
        );
        $this->assertSame([$this->second->id], $this->waits()->readyAmong([$this->second->id]));
    }

    private function waits(): TaskWaitResolver
    {
        return $this->app->make(TaskWaitResolver::class);
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }

    private static function key(): string
    {
        return (string) Str::uuid();
    }
}
