<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Contracts\PlanDetailsReader;
use Domain\Plans\Contracts\PlanReader;
use Domain\Plans\Enums\PlanView;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A plan read counts progress as every plan list does, sees a task finish on the next read, and pages a large plan's
 * task references 50 at a time; a phase read lists its tasks with their state.
 */
final class PlanDetailsReaderTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
    }

    public function test_progress_equals_the_web_lists_and_a_finishing_task_shows_on_the_next_read(): void
    {
        $plan = Plan::factory()->create(['title' => 'Counted plan', 'brief' => 'Count it.']);
        $tasks = Task::factory()->count(3)->create();
        $plan->addPhase('Work')->addTasks(array_values($tasks->modelKeys()));
        $tasks[0]->finish();
        $reader = $this->app->make(PlanDetailsReader::class);

        $details = $reader->plan($plan->id, PlanView::Context);
        $card = $this->app->make(PlanReader::class)->list(new PlanFilters(search: 'Counted plan'))->cards[0];

        $this->assertEquals($card->progress, $details->progress);
        $this->assertSame([1, 3], [$details->progress->done, $details->progress->total]);
        $this->assertSame('Count it.', $details->brief);
        $this->assertNull($reader->plan($plan->id, PlanView::Summary)->brief);

        $tasks[1]->finish();

        $this->assertSame(2, $reader->plan($plan->id, PlanView::Summary)->progress->done);
    }

    public function test_a_plan_with_120_tasks_pages_them_50_at_a_time(): void
    {
        $plan = Plan::factory()->create();
        $plan->addPhase('First')->addTasks(array_values(Task::factory()->count(70)->create()->modelKeys()));
        $plan->addPhase('Second')->addTasks(array_values(Task::factory()->count(50)->create()->modelKeys()));
        $reader = $this->app->make(PlanDetailsReader::class);
        $seen = [];
        $offset = 0;
        $reads = 0;

        do {
            $details = $reader->plan($plan->id, PlanView::Summary, $offset);
            $page = array_merge(...array_map(fn (PlanPhaseTasks $phase): array => $phase->taskIds, $details->phases));
            $this->assertLessThanOrEqual(PlanDetailsReader::TASKS_PER_READ, count($page));
            $seen = [...$seen, ...$page];
            $offset = $details->nextTaskOffset;
            $reads++;
        } while ($offset !== null);

        $this->assertSame(3, $reads);
        $this->assertCount(120, array_unique($seen));
        $this->assertSame($plan->taskIds(), $seen);
    }

    public function test_a_phase_read_lists_its_tasks_in_order_with_their_state(): void
    {
        $plan = Plan::factory()->create();
        [$first, $second] = [Task::factory()->create(['title' => 'First']), Task::factory()->create(['title' => 'Second'])];
        $phase = $plan->addPhase('Work');
        $phase->addTasks([$second->id, $first->id]);
        $first->finish();

        $read = $this->app->make(PlanDetailsReader::class)->phase($phase->id);

        $this->assertSame([['Second', TaskState::Open], ['First', TaskState::Finished]], array_map(fn ($task) => [$task->title, $task->state], $read->tasks));
        $this->assertSame([$plan->id, 'Work', 1], [$read->planId, $read->title, $read->revision]);
    }
}
