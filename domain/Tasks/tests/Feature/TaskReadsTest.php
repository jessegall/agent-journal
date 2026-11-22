<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\CurrentActorSetter;
use App\Exceptions\ActorContextMissing;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Tasks\Contracts\TaskProgressCounter;
use Domain\Tasks\Contracts\TaskResolver;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;

/**
 * Other domains read tasks only through Tasks' published reads: progress counts and visibility checks, with an actor.
 */
final class TaskReadsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_named_task_must_exist_or_the_whole_check_fails(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(3)),
            TestStartAuthority::forAgent(TestIds::of(3)),
        );

        $first = Task::factory()->create(['title' => 'Write the walk']);
        $second = Task::factory()->create(['title' => 'Test the walk']);

        $this->app->make(TaskResolver::class)->requireAllVisible([$first->id, $second->id, $first->id]);

        $this->expectExceptionObject(TaskMissing::forId(TestIds::of(999999)));
        $this->app->make(TaskResolver::class)->requireAllVisible([$first->id, TestIds::of(999999)]);
    }

    public function test_progress_counts_finished_tasks_and_leaves_out_missing_ids(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $done = Task::factory()->create(['title' => 'Write the walk']);
        $done->finish('Done.');
        $open = Task::factory()->create(['title' => 'Test the walk']);

        $progress = $this->app->make(TaskProgressCounter::class)->progressByGroup(
            ['phase' => [$done->id, $open->id, TestIds::of(999999)], 'empty' => []],
        );

        $this->assertSame([1, 2], [$progress['phase']->done, $progress['phase']->total]);
        $this->assertSame(0, $progress['empty']->total);
    }

    public function test_summaries_use_one_read_and_keep_requested_order_and_repeated_ids(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $first = Task::factory()->create(['title' => 'First']);
        $second = Task::factory()->create(['title' => 'Second']);
        $resolver = $this->app->make(TaskResolver::class);
        $connection = $first->getConnection();
        $connection->flushQueryLog();
        $connection->enableQueryLog();

        $summaries = $resolver->summaries([$second->id, $first->id, $second->id]);

        $connection->disableQueryLog();
        $this->assertCount(1, $connection->getQueryLog());
        $this->assertSame([$second->number, $first->number, $second->number], array_column($summaries, 'number'));
    }

    public function test_summaries_fail_for_the_first_missing_id_in_request_order(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );

        $task = Task::factory()->create(['title' => 'Found']);
        $firstMissing = TestIds::of(999999);

        $this->expectExceptionObject(TaskMissing::forId($firstMissing));
        $this->app->make(TaskResolver::class)->summaries([$task->id, $firstMissing, TestIds::of(888888)]);
    }

    public function test_nothing_is_counted_or_checked_without_an_actor(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(TaskProgressCounter::class)->progressOf([1]);
    }
}
