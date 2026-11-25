<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Enums\CommandRules\ReadView;
use Domain\Plans\Contracts\PlanDetailsResolver;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\Fixtures\PlanFixtures;
use Domain\Plans\Tests\TestCase;
use Domain\Plans\Values\PlanFilters;
use Domain\Plans\Values\PlanPhaseTasks;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A plan read counts progress as every plan list does, sees a task finish on the next read, and pages a large plan's
 * task references 50 at a time; a phase read lists its tasks with their state.
 */
final class PlanDetailsResolverTest extends TestCase
{
    use CommitsHookRows;

    private const string BRIEF = 'Count it.';

    private const array TABLES = [
        'plans',
        'phases',
        'phase_tasks',
        'tasks',
        'task_runs',
        'agent_stacks',
        'claim_authorizations',
        'command_receipts',
        'users',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_progress_equals_the_web_lists_and_a_finishing_task_shows_on_the_next_read(): void
    {
        $plan = $this->plans()->plan('plan', brief: self::BRIEF, title: 'Counted plan')->planCalled('plan');
        $tasks = Task::factory()->count(3)->create();
        $tasks[0]->finish('Done.');

        $this->planStructure()->addTasks(
            $this->planStructure()->addPhase($plan, 'Work'),
            array_values($tasks->modelKeys()),
        );

        $resolver = $this->app->make(PlanDetailsResolver::class);

        $details = $resolver->plan($plan->id, ReadView::Context);
        $card = $this->app->make(PlanResolver::class)->list(new PlanFilters(search: 'Counted plan'))->cards[0];

        $this->assertEquals($card->progress, $details->progress);
        $this->assertSame([
            1,
            3,
        ], [
            $details->progress->finished,
            $details->progress->total,
        ]);
        $this->assertSame(self::BRIEF, $details->brief);
        $this->assertNull($resolver->plan($plan->id, ReadView::Summary)->brief);

        $this->journal->run(new StartTaskCommand($tasks[1]->id));
        $this->journal->run(new FinishTaskCommand($tasks[1]->id, 1, 'Done.'));

        $this->assertSame(2, $resolver->plan($plan->id, ReadView::Summary)->progress->finished);
    }

    #[TimeLimit(seconds: 5, reason: 'It builds 120 tasks in one plan and reads them in three pages.')]
    public function test_a_plan_with_120_tasks_pages_them_50_at_a_time(): void
    {
        $plan = $this->plans()->plan('plan')->planCalled('plan');

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
            $page = array_merge(...array_map(fn (PlanPhaseTasks $phase) => $phase->taskIds, $details->phases));
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
        $plan = $this->plans()->plan('plan')->planCalled('plan');

        [$first, $second] = [
            Task::factory()->create(['title' => 'First']),
            Task::factory()->create(['title' => 'Second']),
        ];

        $phase = $this->planStructure()->addPhase($plan, 'Work');
        $this->planStructure()->addTasks($phase, [
            $second->id,
            $first->id,
        ]);

        $read = $this->app->make(PlanDetailsResolver::class)->phase($phase->id);

        $this->assertSame([
            $second->id,
            $first->id,
        ], $read->taskIds);
        $this->assertSame([
            $plan->id,
            'Work',
            2,
        ], [
            $read->planId,
            $read->title,
            $read->revision,
        ]);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }

    private function plans(): PlanFixtures
    {
        return $this->journal->fixtures(PlanFixtures::class);
    }
}
