<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentResolver;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\AssigneeIdentity;
use App\Support\IdListPage;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
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

        $this->journal->owner();

        $this->owner = User::factory()->create(['name' => 'Jesse']);
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->helper = AssigneeIdentity::of(Agent::create('Helper', 'read-only-helper', $this->localProject()));
        $this->journal->actAsUserId($this->owner->id);
    }

    public function test_a_holders_record_ids_come_page_by_page_and_skip_records_that_no_longer_exist(): void
    {
        $tasks = array_map(
            fn (int $number) => $this->tasks()->task("Task {$number}")->taskCalled("Task {$number}"),
            range(1, 5),
        );
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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
