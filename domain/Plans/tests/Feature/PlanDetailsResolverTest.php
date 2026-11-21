<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Reads\Enums\ReadView;
use Domain\Plans\Api\PlanFilters;
use Domain\Plans\Api\PlanPhaseTasks;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A plan read counts progress as every plan list does, sees a task finish on the next read, and pages a large plan's
 * task references 50 at a time; a phase read lists its tasks with their state.
 */
final class PlanDetailsResolverTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks'];

    public function test_progress_equals_the_web_lists_and_a_finishing_task_shows_on_the_next_read(): void
    {
        $plan = Plan::factory()->create(['title' => 'Counted plan', 'brief' => 'Count it.']);
        $tasks = Task::factory()->count(3)->create();

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Work'),
            array_values($tasks->modelKeys()),
        );

        $tasks[0]->finish('Done.');
        $resolver = $this->app->make(PlanDetailsResolver::class);

        $details = $resolver->plan($plan->id, ReadView::Context);
        $card = $this->app->make(PlanResolver::class)->list(new PlanFilters(search: 'Counted plan'))->cards[0];

        $this->assertEquals($card->progress, $details->progress);
        $this->assertSame([1, 3], [$details->progress->done, $details->progress->total]);
        $this->assertSame('Count it.', $details->brief);
        $this->assertNull($resolver->plan($plan->id, ReadView::Summary)->brief);

        $tasks[1]->finish('Done.');

        $this->assertSame(2, $resolver->plan($plan->id, ReadView::Summary)->progress->done);
    }

    #[TimeLimit(seconds: 5, reason: 'It builds 120 tasks in one plan and reads them in three pages.')]
    public function test_a_plan_with_120_tasks_pages_them_50_at_a_time(): void
    {
        $plan = Plan::factory()->create();

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'First'),
            array_values(Task::factory()->count(70)->create()->modelKeys()),
        );

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Second'),
            array_values(Task::factory()->count(50)->create()->modelKeys()),
        );

        $resolver = $this->app->make(PlanDetailsResolver::class);
        $seen = [];
        $offset = 0;
        $reads = 0;

        do {
            $details = $resolver->plan($plan->id, ReadView::Summary, $offset);
            $page = array_merge(...array_map(fn (PlanPhaseTasks $phase): array => $phase->taskIds, $details->phases));
            $this->assertLessThanOrEqual(PlanDetailsResolver::TASKS_PER_READ, count($page));
            $seen = [...$seen, ...$page];
            $offset = $details->nextTaskOffset;
            $reads++;
        } while ($offset !== null);

        $this->assertSame(3, $reads);
        $this->assertCount(120, array_unique($seen));
        $this->assertSame($plan->taskIds(), $seen);
    }

    public function test_a_phase_read_lists_its_task_references_in_order(): void
    {
        $plan = Plan::factory()->create();

        [$first, $second] = [
            Task::factory()->create(['title' => 'First']),
            Task::factory()->create(['title' => 'Second']),
        ];

        $phase = $this->planStructure()->addPhase($plan, 'Work');
        $this->planStructure()->addTasks($phase, [$second->id, $first->id]);

        $read = $this->app->make(PlanDetailsResolver::class)->phase($phase->id);

        $this->assertSame([$second->id, $first->id], $read->taskIds);
        $this->assertSame([$plan->id, 'Work', 1], [$read->planId, $read->title, $read->revision]);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
