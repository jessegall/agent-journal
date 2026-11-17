<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Agents\Models\Agent;
use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentReader;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Core\Assignments\Exceptions\InvalidAssignmentPage;
use App\Core\Assignments\Support\Page;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Access\Models\User;
use App\Domain\Access\Support\AccessSettings;
use App\Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Reading assignments: a batch of records costs one visibility query per type and one assignment query, a holder's
 * record ids come page by page with a cursor that hides nothing, and names come from each actor type's owner.
 */
final class AssignmentReadersTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments'];

    private User $owner;

    private ActorIdentity $helper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['name' => 'Jesse']);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->helper = ActorIdentity::of(Agent::query()->create(['name' => 'Helper', 'role' => 'hooks.read_only_helper_ready']));
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_twenty_records_of_one_type_cost_one_visibility_query_and_one_assignment_query(): void
    {
        $tasks = array_map(fn (int $number) => Task::query()->create(['title' => "Task {$number}"])->assignmentIdentity(), range(1, 20));
        $writer = $this->app->make(AssignmentWriter::class);
        $writer->assign($tasks[0], $this->helper);
        $writer->assign($tasks[5], $this->helper);

        DB::flushQueryLog();
        DB::enableQueryLog();
        $set = $this->app->make(AssignmentReader::class)->assignmentsFor($tasks);
        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertCount(2, $queries);
        $this->assertCount(2, $set->assignments);
        $this->assertTrue($set->forRecord($tasks[5])->get()->holder()->isSameAs($this->helper));
        $this->assertTrue($set->forRecord($tasks[1])->isEmpty());
    }

    public function test_a_holders_record_ids_come_page_by_page_and_skip_records_that_no_longer_exist(): void
    {
        $tasks = array_map(fn (int $number) => Task::query()->create(['title' => "Task {$number}"]), range(1, 5));
        $writer = $this->app->make(AssignmentWriter::class);

        foreach ($tasks as $task) {
            $writer->assign($task->assignmentIdentity(), $this->helper);
        }

        Task::query()->whereKey($tasks[1]->id)->delete();
        $reader = $this->app->make(AssignmentReader::class);

        $first = $reader->recordIdsFor('tasks.task', $this->helper, new Page(null, 2));
        $second = $reader->recordIdsFor('tasks.task', $this->helper, new Page($first->nextAfterId, 2));
        $last = $reader->recordIdsFor('tasks.task', $this->helper, new Page($second->nextAfterId, 2));

        $this->assertSame([$tasks[0]->id, $tasks[2]->id], $first->ids);
        $this->assertSame([$tasks[3]->id, $tasks[4]->id], $second->ids);
        $this->assertSame([], $last->ids);
        $this->assertNull($last->nextAfterId);
    }

    public function test_more_than_a_hundred_records_or_an_unknown_type_is_refused(): void
    {
        $reader = $this->app->make(AssignmentReader::class);

        $this->assertThrows(fn () => $reader->assignmentsFor(array_map(fn (int $id) => new RecordIdentity('tasks.task', $id), range(1, 101))), InvalidAssignmentPage::class);
        $this->assertThrows(fn () => $reader->assignmentsFor([new RecordIdentity('notes.note', 1)]), AssignmentTypeUnavailable::class);
    }

    public function test_names_come_from_each_actor_types_owner(): void
    {
        $names = $this->app->make(AssigneeReader::class)->names([$this->helper, ActorIdentity::of($this->owner)]);
        $users = $this->app->make(AssigneeReader::class)->eligible(ActorType::User, new Page);

        $this->assertEqualsCanonicalizing(['Helper', 'Jesse'], array_map(fn ($name) => $name->name, $names));
        $this->assertSame(['Jesse'], array_map(fn ($name) => $name->name, $users->assignees));
    }

    public function test_nothing_is_read_without_someone_acting(): void
    {
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(AssignmentReader::class)->assignmentsFor([new RecordIdentity('tasks.task', 1)]);
    }
}
