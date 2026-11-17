<?php

declare(strict_types=1);

namespace Tests\Feature\Tasks;

use App\Core\Actors\ActorContext;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Contracts\EstablishActor;
use App\Domain\Tasks\Contracts\TaskProgressCounter;
use App\Domain\Tasks\Contracts\TaskReader;
use App\Domain\Tasks\Exceptions\TaskMissing;
use App\Domain\Tasks\Models\Task;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Other domains read tasks only through Tasks' published reads: progress counts and visibility checks, with an actor.
 */
final class TaskReadsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_named_task_must_exist_or_the_whole_check_fails(): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forAgent(3));
        $first = Task::query()->create(['title' => 'Write the walk']);
        $second = Task::query()->create(['title' => 'Test the walk']);

        $this->app->make(TaskReader::class)->requireAllVisible([$first->id, $second->id, $first->id]);

        $this->expectExceptionObject(TaskMissing::forId(999999));
        $this->app->make(TaskReader::class)->requireAllVisible([$first->id, 999999]);
    }

    public function test_progress_counts_finished_tasks_and_leaves_out_missing_ids(): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forUser(7));
        $done = Task::query()->create(['title' => 'Write the walk']);
        $done->finish();
        $open = Task::query()->create(['title' => 'Test the walk']);

        $progress = $this->app->make(TaskProgressCounter::class)->progressByGroup(['phase' => [$done->id, $open->id, 999999], 'empty' => []]);

        $this->assertSame([1, 2], [$progress['phase']->done, $progress['phase']->total]);
        $this->assertSame(0, $progress['empty']->total);
    }

    public function test_nothing_is_counted_or_checked_without_an_actor(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(TaskProgressCounter::class)->progressOf([1]);
    }
}
