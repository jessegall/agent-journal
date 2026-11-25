<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Assignments\AssignmentResolver;
use App\Exceptions\ActorContextMissing;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Exceptions\InvalidAssignmentPage;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use App\Support\IdListPage;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Facades\DB;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Reading assignments: a batch of records costs one visibility query per type and one assignment query, a holder's
 * record ids come page by page with a cursor that hides nothing, and names come from each actor type's owner.
 */
final class AssignmentResolversTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents', 'tasks', 'assignments'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private User $owner;

    private AssigneeIdentity $helper;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create(['name' => 'Jesse']);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->helper = AssigneeIdentity::of(Agent::create('Helper', 'read-only-helper', $this->localProject()));
        $this->journal->actAsUserId($this->owner->id);
    }

    public function test_twenty_records_of_one_type_cost_one_visibility_query_and_one_assignment_query(): void
    {
        $tasks = array_map(
            fn (int $number) => Task::factory()->create(['title' => "Task {$number}"])->assignmentIdentity(),
            range(1, 20),
        );
        $writer = $this->app->make(AssignmentWriterInTransaction::class);
        $writer->assign($tasks[0], $this->helper);
        $writer->assign($tasks[5], $this->helper);

        DB::flushQueryLog();
        DB::enableQueryLog();
        $set = $this->app->make(AssignmentResolver::class)->assignmentsFor($tasks);
        $queries = DB::getQueryLog();
        DB::disableQueryLog();

        $this->assertCount(2, $queries);
        $this->assertCount(2, $set->assignments);
        $this->assertTrue($set->forRecord($tasks[5])->get()->holder()->isSameAs($this->helper));
        $this->assertTrue($set->forRecord($tasks[1])->isEmpty());
    }

    public function test_a_holders_record_ids_come_page_by_page_and_skip_records_that_no_longer_exist(): void
    {
        $tasks = array_map(fn (int $number) => Task::factory()->create(['title' => "Task {$number}"]), range(1, 5));
        $writer = $this->app->make(AssignmentWriterInTransaction::class);

        foreach ($tasks as $task) {
            $writer->assign($task->assignmentIdentity(), $this->helper);
        }

        Task::query()->whereKey($tasks[1]->id)->delete();
        $resolver = $this->app->make(AssignmentResolver::class);

        $first = $resolver->recordIdsFor('tasks.task', $this->helper, new IdListPage(null, 2));
        $second = $resolver->recordIdsFor('tasks.task', $this->helper, new IdListPage($first->nextAfterId, 2));
        $last = $resolver->recordIdsFor('tasks.task', $this->helper, new IdListPage($second->nextAfterId, 2));

        $this->assertSame([$tasks[0]->id, $tasks[2]->id], $first->ids);
        $this->assertSame([$tasks[3]->id, $tasks[4]->id], $second->ids);
        $this->assertSame([], $last->ids);
        $this->assertNull($last->nextAfterId);
    }

    public function test_more_than_a_hundred_records_or_an_unknown_type_is_refused(): void
    {
        $resolver = $this->app->make(AssignmentResolver::class);

        $this->assertThrows(
            fn () => $resolver->assignmentsFor(
                array_map(fn (int $number) => TestActors::record('tasks.task', $number), range(1, 101)),
            ),
            InvalidAssignmentPage::class,
        );
        $this->assertThrows(
            fn () => $resolver->assignmentsFor([TestActors::record('notes.note', 1)]),
            AssignmentTypeUnavailable::class,
        );
    }

    public function test_names_come_from_each_actor_types_owner(): void
    {
        $names = $this->app->make(AssigneeResolver::class)->names([$this->helper, AssigneeIdentity::of($this->owner)]);
        $users = $this->app->make(AssigneeResolver::class)->eligible(User::storedType(), new IdListPage());

        $this->assertEqualsCanonicalizing(['Helper', 'Jesse'], array_map(fn ($name) => $name->name, $names));
        $this->assertSame(['Jesse'], array_map(fn ($name) => $name->name, $users->assignees));
    }

    public function test_nothing_is_read_without_someone_acting(): void
    {
        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(AssignmentResolver::class)->assignmentsFor([TestActors::record('tasks.task', 1)]);
    }
}
