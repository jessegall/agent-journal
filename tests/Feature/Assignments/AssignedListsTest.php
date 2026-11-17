<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Exceptions\AgentActorRequired;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Exceptions\InvalidAssignmentPage;
use App\Core\Assignments\Support\NumberedPage;
use App\Domain\Plans\Api\AssignedPlanFilters;
use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Models\Plan;
use App\Domain\Tasks\Api\TaskFilters;
use App\Domain\Tasks\Contracts\AssignedTaskReader;
use App\Domain\Tasks\Enums\TaskState;
use App\Domain\Tasks\Models\Task;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
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

    private const array TABLES = ['agents', 'tasks', 'plans', 'phases', 'phase_tasks', 'assignments'];

    private Agent $main;

    private Agent $other;

    protected function setUp(): void
    {
        parent::setUp();

        $this->main = Agent::query()->create(['name' => 'Main', 'role' => 'hooks.main_ready']);
        $this->other = Agent::query()->create(['name' => 'Other', 'role' => 'hooks.helper_ready']);
        $this->startRequestAs($this->main->id, 1);
    }

    protected function tearDown(): void
    {
        if ($this->app->make('config')->has('database.connections.lists_other')) {
            DB::connection('lists_other')->disconnect();
        }

        parent::tearDown();
    }

    public function test_only_directly_held_tasks_are_listed_by_id_finished_ones_included(): void
    {
        $writer = $this->app->make(AssignmentWriter::class);
        $held = Task::query()->create(['title' => 'Write the reader']);
        $finished = Task::query()->create(['title' => 'Write the store']);
        $finished->finish();
        $othersTask = Task::query()->create(['title' => 'Not mine']);
        Task::query()->create(['title' => 'Nobody holds this']);
        $writer->assign($finished->assignmentIdentity(), ActorIdentity::of($this->main));
        $writer->assign($held->assignmentIdentity(), ActorIdentity::of($this->main));
        $writer->assign($othersTask->assignmentIdentity(), ActorIdentity::of($this->other));

        $list = $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters);
        $finishedOnly = $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters(states: [TaskState::Finished]));
        $searched = $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters(search: 'READER', page: new NumberedPage(1, 1)));

        $this->assertSame([$held->id, $finished->id], array_map(fn ($card) => $card->id, $list->cards));
        $this->assertSame(2, $list->total);
        $this->assertSame('Main', $list->cards[0]->holder->name);
        $this->assertSame([$finished->id], array_map(fn ($card) => $card->id, $finishedOnly->cards));
        $this->assertSame([1, $held->id], [$searched->total, $searched->cards[0]->id]);
    }

    public function test_a_held_plan_is_listed_but_holding_one_of_its_tasks_adds_no_plan(): void
    {
        $writer = $this->app->make(AssignmentWriter::class);
        $plan = Plan::query()->create(['title' => 'Release', 'kind' => PlanKind::Build]);
        $other = Plan::query()->create(['title' => 'Research', 'kind' => PlanKind::Research]);
        $task = Task::query()->create(['title' => 'In the research plan']);
        $other->addPhase('One')->addTasks([$task->id]);
        $writer->assign($plan->assignmentIdentity(), ActorIdentity::of($this->main));
        $writer->assign($task->assignmentIdentity(), ActorIdentity::of($this->main));

        $list = $this->app->make(PlanReader::class)->assignedToCaller(new AssignedPlanFilters);

        $this->assertSame([$plan->id], array_map(fn ($card) => $card->id, $list->cards));
        $this->assertSame(1, $list->total);
    }

    public function test_an_agent_holding_nothing_gets_an_empty_list_not_all_work(): void
    {
        Task::query()->create(['title' => 'Someone elses']);

        $list = $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters);

        $this->assertSame([[], 0], [$list->cards, $list->total]);
    }

    public function test_rows_and_total_come_from_one_snapshot(): void
    {
        $writer = $this->app->make(AssignmentWriter::class);
        $writer->assign(Task::query()->create(['title' => 'First'])->assignmentIdentity(), ActorIdentity::of($this->main));
        $late = Task::query()->create(['title' => 'Assigned meanwhile']);
        $other = $this->otherConnection();

        [$before, $after] = $this->app->make(AssignmentTransaction::class)->run(function () use ($other, $late): array {
            $before = $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters);
            $other->table('assignments')->insert(['record_type' => 'tasks.task', 'record_id' => $late->id, 'holder_kind' => 'agent', 'holder_id' => $this->main->id, 'created_at' => now(), 'updated_at' => now()]);

            return [$before, $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters)];
        });

        $this->assertSame([1, 1], [$before->total, $after->total]);
        $this->assertCount(1, $after->cards);
    }

    public function test_a_user_has_no_assigned_list_and_a_bad_page_is_refused(): void
    {
        $this->startUserRequestAs(1);

        $this->assertThrows(fn () => $this->app->make(AssignedTaskReader::class)->assignedToCaller(new TaskFilters), AgentActorRequired::class);
        $this->assertThrows(fn () => new NumberedPage(0, 20), InvalidAssignmentPage::class);
        $this->assertThrows(fn () => new NumberedPage(1, 101), InvalidAssignmentPage::class);
    }

    private function otherConnection(): Connection
    {
        $config = $this->app->make('config');
        $config->set('database.connections.lists_other', $config->get('database.connections.'.$config->get('database.default')));

        return DB::connection('lists_other');
    }
}
