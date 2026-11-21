<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use Domain\Plans\Models\Plan;
use Domain\Plans\Support\OutlinePageAsk;
use Domain\Plans\Support\PlanOutline;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Tests\Support\ActsAsTestUser;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A plan's outline is read by cursor: a page of phase headings and a page of one phase's tasks each read the same
 * number of rows and queries however large the plan or the phase, and a phase whose revision moved is read anew.
 */
final class PlanOutlineTest extends TestCase
{
    use ActsAsTestUser;
    use CommitsHookRows;

    private const array TABLES = ['plans', 'phases', 'phase_tasks', 'tasks'];

    #[TimeLimit(seconds: 30, reason: 'It builds a phase of 1,500 tasks and a plan of 300 one-task phases.')]
    public function test_first_and_second_pages_read_the_same_rows_whatever_the_totals(): void
    {
        $small = Plan::factory()->create();
        $smallPhase = $this->structure()->addPhase($small, 'Small');
        $this->structure()->addTasks($smallPhase, $this->taskIds(3));

        $giant = Plan::factory()->create();
        $giantPhase = $this->structure()->addPhase($giant, 'Giant');
        $this->structure()->addTasks($giantPhase, $this->taskIds(1500));

        $wide = Plan::factory()->create();

        foreach (range(1, 300) as $position) {
            $this->structure()->addTasks($this->structure()->addPhase($wide, "Phase {$position}"), $this->taskIds(1));
        }

        $giantFirst = $this->measured(fn () => $this->outline()->of(
            $giant->id,
            1,
            new OutlinePageAsk(phase: 1, revision: $giantPhase->fresh()?->revision ?? 0),
        ));
        $giantSecond = $this->measured(fn () => $this->outline()->of(
            $giant->id,
            1,
            new OutlinePageAsk(phase: 1, tasksAfter: 50, revision: $giantPhase->fresh()?->revision ?? 0),
        ));
        $smallFirst = $this->measured(fn () => $this->outline()->of(
            $small->id,
            1,
            new OutlinePageAsk(phase: 1, revision: $smallPhase->fresh()?->revision ?? 0),
        ));
        $wideFirst = $this->measured(fn () => $this->outline()->of($wide->id, 1, new OutlinePageAsk()));
        $wideSecond = $this->measured(fn () => $this->outline()->of($wide->id, 1, new OutlinePageAsk(phasesAfter: 50)));

        $this->assertSame($smallFirst['queries'], $giantFirst['queries']);
        $this->assertSame($giantFirst['queries'], $giantSecond['queries']);
        $this->assertSame($wideFirst['queries'], $wideSecond['queries']);
        $this->assertLessThanOrEqual(PlanOutline::TASKS_PER_PAGE * 2 + 5, $giantSecond['models']);
        $this->assertLessThanOrEqual(PlanOutline::PHASES_PER_PAGE + 5, $wideSecond['models']);

        $page = $this->outline()->of($giant->id, 1, new OutlinePageAsk(phase: 1, tasksAfter: 50, revision: 2));
        $this->assertCount(50, $page->phaseTasks->rows);
        $this->assertSame('100', $page->phaseTasks->nextAfter);
        $this->assertSame('50', $this->outline()->of($wide->id, 1, new OutlinePageAsk())->nextPhasesAfter);
    }

    public function test_a_phase_whose_revision_moved_answers_its_first_page_again(): void
    {
        $plan = Plan::factory()->create();
        $phase = $this->structure()->addPhase($plan, 'Work');
        $this->structure()->addTasks($phase, $this->taskIds(60));
        $heldRevision = (int) $phase->fresh()?->revision;

        $this->structure()->addTasks($phase, $this->taskIds(1));

        $page = $this->outline()->of($plan->id, 1, new OutlinePageAsk(phase: 1, tasksAfter: 50, revision: $heldRevision));

        $this->assertTrue($page->phaseTasks->isRevisionChanged);
        $this->assertSame('0', $page->phaseTasks->after);
        $this->assertSame($heldRevision + 1, $page->phaseTasks->revision);
    }

    /**
     * @return list<string>
     */
    private function taskIds(int $count): array
    {
        return array_values(Task::factory()->count($count)->create()->modelKeys());
    }

    /**
     * @return array{queries: int, models: int}
     */
    private function measured(callable $read): array
    {
        $models = 0;
        Event::listen('eloquent.retrieved: *', function () use (&$models): void {
            $models++;
        });
        DB::flushQueryLog();
        DB::enableQueryLog();

        $read();

        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();
        Event::forget('eloquent.retrieved: *');

        return ['queries' => $queries, 'models' => $models];
    }

    private function outline(): PlanOutline
    {
        return $this->app->make(PlanOutline::class);
    }

    private function structure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
