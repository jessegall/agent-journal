<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Exceptions\ActorContextMissing;
use App\Assignments\Registry\AssignmentRegistry;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Contracts\TaskAssignmentReader;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Tasks, plans and phases as assignable records: each type is registered with its owner's provider, every signed-in
 * actor may see every record, and a record's work is over by its own rule; an empty phase is not over.
 */
final class AssignableRecordsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['tasks', 'plans', 'phases', 'phase_tasks'];

    private AssignmentRegistry $registry;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registry = $this->app->make(AssignmentRegistry::class);
        $this->startUserRequestAs(TestIds::of(1));
    }

    public function test_a_task_resolves_under_its_alias_and_a_missing_one_is_unavailable(): void
    {
        $task = Task::factory()->create(['title' => 'Write the reader']);

        $resolved = $this->registry->recordProvider(Task::LINK_TYPE)->requireAssignable($task->assignmentIdentity());

        $this->assertTrue($resolved->assignmentIdentity()->isSameAs(new RecordIdentity('tasks.task', $task->id)));
        $this->assertThrows(fn () => $this->registry->recordProvider(Task::LINK_TYPE)->requireAssignable(new RecordIdentity('tasks.task', TestIds::of(999999))), RecordUnavailable::class);
    }

    public function test_visible_records_keep_the_input_order_and_leave_out_missing_ones(): void
    {
        $first = Task::factory()->create(['title' => 'One']);
        $second = Task::factory()->create(['title' => 'Two']);

        $visible = $this->registry->recordProvider(Task::LINK_TYPE)->visibleRecords([
            $second->assignmentIdentity(),
            new RecordIdentity('tasks.task', TestIds::of(999999)),
            $first->assignmentIdentity(),
        ]);

        $this->assertSame([$second->id, $first->id], array_map(fn (RecordIdentity $record) => $record->id, $visible));
    }

    public function test_finished_and_cancelled_tasks_and_plans_are_over(): void
    {
        $open = Task::factory()->create(['title' => 'Open']);
        $finished = Task::factory()->create(['title' => 'Finished']);
        $finished->finish();
        $cancelled = Task::factory()->create(['title' => 'Cancelled']);
        $cancelled->cancel();
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);

        $overTasks = $this->registry->recordProvider(Task::LINK_TYPE)->finishedRecords([$open, $finished, $cancelled]);
        $overPlans = $this->registry->recordProvider(Plan::LINK_TYPE)->finishedRecords([$plan]);

        $this->assertSame([$finished->id, $cancelled->id], array_map(fn (RecordIdentity $record) => $record->id, $overTasks));
        $this->assertSame([], $overPlans);
    }

    public function test_a_phase_is_over_only_when_it_holds_tasks_and_all_ended(): void
    {
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $empty = $plan->addPhase('Empty');
        $allEnded = $plan->addPhase('All ended');
        $mixed = $plan->addPhase('Mixed');
        $done = Task::factory()->create(['title' => 'Done']);
        $done->finish();
        $dropped = Task::factory()->create(['title' => 'Dropped']);
        $dropped->cancel();
        $running = Task::factory()->create(['title' => 'Running']);
        $allEnded->addTasks([$done->id, $dropped->id]);
        $mixed->addTasks([$running->id]);

        $over = $this->registry->recordProvider(Phase::LINK_TYPE)->finishedRecords([$empty, $allEnded, $mixed]);

        $this->assertSame([$allEnded->id], array_map(fn (RecordIdentity $record) => $record->id, $over));
    }

    public function test_a_missing_task_in_a_group_refuses_the_whole_read(): void
    {
        $task = Task::factory()->create(['title' => 'One']);

        $this->expectException(TaskMissing::class);

        $this->app->make(TaskAssignmentReader::class)->completionOf(['phase' => [$task->id, TestIds::of(999999)]]);
    }

    public function test_nothing_is_read_without_someone_acting(): void
    {
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(AssignmentRegistry::class)->recordProvider(Task::LINK_TYPE)->visibleRecords([new RecordIdentity('tasks.task', TestIds::of(1))]);
    }
}
