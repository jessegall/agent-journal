<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Exceptions\InvalidAssignmentPage;
use App\Models\Agent;
use App\Support\AssigneeIdentity;
use App\Support\NumberedPage;
use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Support\PlanStructure;
use Domain\Plans\Values\AssignedPlanFilters;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Values\TaskFilters;
use Illuminate\Support\Str;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;

/**
 * The calling agent's own lists: only the tasks and plans it holds directly, finished ones included, filtered, ordered
 * and paged by their owners, with rows and total from one snapshot; another agent's work, running a task or holding a
 * plan's task does not count.
 */
final class AssignedListsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use UsesSecondConnection;

    private const array TABLES = ['agents', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private Agent $main;

    private Agent $other;

    protected function setUp(): void
    {
        parent::setUp();

        $this->main = Agent::create('Main', 'main-agent');
        $this->other = Agent::create('Other', 'read-only-helper');
        $this->startRequestAs($this->main->id, TestIds::of(1));
    }

    public function test_only_directly_held_tasks_are_listed_by_id_finished_ones_included(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $held = Task::factory()->create(['title' => 'Write the reader']);
        $finished = Task::factory()->create(['title' => 'Write the store']);
        $finished->finish('Done.');
        $othersTask = Task::factory()->create(['title' => 'Not mine']);
        Task::factory()->create(['title' => 'Nobody holds this']);
        $writer->assign($finished->assignmentIdentity(), AssigneeIdentity::of($this->main));
        $writer->assign($held->assignmentIdentity(), AssigneeIdentity::of($this->main));
        $writer->assign($othersTask->assignmentIdentity(), AssigneeIdentity::of($this->other));

        $list = $this->app->make(AssignedTaskResolver::class)->assignedToCaller(new TaskFilters());
        $finishedOnly = $this->app->make(AssignedTaskResolver::class)->assignedToCaller(
            new TaskFilters(states: [TaskState::Finished]),
        );
        $searched = $this->app->make(AssignedTaskResolver::class)->assignedToCaller(
            new TaskFilters(search: 'READER', page: new NumberedPage(1, 1)),
        );

        $this->assertSame([$held->id, $finished->id], array_map(fn ($card) => $card->id, $list->cards));
        $this->assertSame(2, $list->total);
        $this->assertSame('Main', $list->cards[0]->holder->get()->name);
        $this->assertSame([$finished->id], array_map(fn ($card) => $card->id, $finishedOnly->cards));
        $this->assertSame([1, $held->id], [$searched->total, $searched->cards[0]->id]);
    }

    public function test_a_held_plan_is_listed_but_holding_one_of_its_tasks_adds_no_plan(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $other = Plan::factory()->create(['title' => 'Research', 'type' => PlanType::Research]);
        $task = Task::factory()->create(['title' => 'In the research plan']);
        $this->planStructure()->addTasks($this->planStructure()->addPhase($other, 'One'), [$task->id]);
        $writer->assign($plan->assignmentIdentity(), AssigneeIdentity::of($this->main));
        $writer->assign($task->assignmentIdentity(), AssigneeIdentity::of($this->main));

        $list = $this->app->make(PlanResolver::class)->assignedToCaller(new AssignedPlanFilters());

        $this->assertSame([$plan->id], array_map(fn ($card) => $card->id, $list->cards));
        $this->assertSame(1, $list->total);
    }

    public function test_an_agent_holding_nothing_gets_an_empty_list_not_all_work(): void
    {
        Task::factory()->create(['title' => 'Someone elses']);

        $list = $this->app->make(AssignedTaskResolver::class)->assignedToCaller(new TaskFilters());

        $this->assertSame([[], 0], [$list->cards, $list->total]);
    }

    public function test_rows_and_total_come_from_one_snapshot(): void
    {
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign(
            Task::factory()->create(['title' => 'First'])->assignmentIdentity(),
            AssigneeIdentity::of($this->main),
        );
        $late = Task::factory()->create(['title' => 'Assigned meanwhile']);
        $other = $this->otherConnection();

        [$before, $after] = $this->app->make(AssignmentTransaction::class)->run(function () use ($other, $late): array {
            $before = $this->app->make(AssignedTaskResolver::class)->assignedToCaller(new TaskFilters());
            $other->table('assignments')->insert(
                [
                    'id' => strtolower((string) Str::ulid()),
                    'record_type' => 'tasks.task',
                    'record_id' => $late->id,
                    'holder_type' => 'agent',
                    'holder_id' => $this->main->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );

            return [$before, $this->app->make(AssignedTaskResolver::class)->assignedToCaller(new TaskFilters())];
        });

        $this->assertSame([1, 1], [$before->total, $after->total]);
        $this->assertCount(1, $after->cards);
    }

    public function test_a_user_reads_its_own_empty_assigned_list_and_a_bad_page_is_refused(): void
    {
        $this->startTestUserRequest(1);

        $this->assertSame(0, $this->app->make(AssignedTaskResolver::class)->assignedToCaller(new TaskFilters())->total);
        $this->assertThrows(fn () => new NumberedPage(0, 20), InvalidAssignmentPage::class);
        $this->assertThrows(fn () => new NumberedPage(1, 101), InvalidAssignmentPage::class);
    }

    private function planStructure(): PlanStructure
    {
        return $this->app->make(PlanStructure::class);
    }
}
