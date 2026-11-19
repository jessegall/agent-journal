<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Enums\PoolMembersType;
use App\Assignments\Exceptions\InvalidRecordIds;
use App\Assignments\Support\PoolDefinition;
use App\Assignments\Support\PoolReference;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Api\TaskType;
use Domain\Tasks\Assignments\ActiveTaskAssignments;
use Domain\Tasks\Assignments\NamedTaskPoolFactory;
use Domain\Tasks\Assignments\OpenTaskPoolFactory;
use Domain\Tasks\Assignments\TaskAssigner;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Exceptions\TaskPoolRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\HasBuilderAgent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;

/**
 * Tasks declares its auto-assigner and the pools tasks.open and tasks.named at boot; each pool refuses a reference
 * that does not fit it, and a named pool opens to its tasks in the listed order while every one of them exists.
 */
final class TaskPoolsTest extends TestCase
{
    use HasBuilderAgent;
    use RefreshHookDatabase;

    public function test_tasks_declares_its_assigner_and_two_pools_at_boot(): void
    {
        $providers = $this->app->make(AssignmentProviders::class);

        $keys = array_map(fn (PoolDefinition $pool) => $pool->key, $providers->pools(TaskType::VALUE));

        $tasksPools = array_values(array_intersect($keys, ['tasks.open', 'tasks.named']));

        $this->assertSame(['tasks.open', 'tasks.named'], $tasksPools);
        $this->assertSame('Tasks', $providers->poolOwner('tasks.open'));
        $this->assertSame('Tasks', $providers->poolOwner('tasks.named'));
        $this->assertInstanceOf(OpenTaskPoolFactory::class, $providers->poolFactory('tasks.open'));
        $this->assertInstanceOf(NamedTaskPoolFactory::class, $providers->poolFactory('tasks.named'));
        $this->assertInstanceOf(TaskAssigner::class, $providers->autoAssigner(TaskType::VALUE));
        $this->assertInstanceOf(ActiveTaskAssignments::class, $providers->assignedWork(TaskType::VALUE));
    }

    public function test_the_open_pool_takes_neither_a_target_nor_a_list(): void
    {
        $factory = $this->app->make(OpenTaskPoolFactory::class);
        $task = Task::factory()->create()->id;

        $this->assertSame(
            PoolMembersType::All,
            $factory->open(new PoolReference('tasks.open', null, []), $this->builder)->members()->type,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('tasks.open', new RecordIdentity('plans.plan', TestIds::of(40)), []),
                $this->builder,
            ),
            TaskPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(new PoolReference('tasks.open', null, [$task]), $this->builder),
            TaskPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(new PoolReference('tasks.named', null, []), $this->builder),
            TaskPoolRefused::class,
        );
    }

    public function test_a_named_pool_opens_to_its_tasks_in_the_listed_order(): void
    {
        $first = Task::factory()->create()->id;
        $second = Task::factory()->create()->id;
        $third = Task::factory()->create()->id;

        $members = $this->app->make(NamedTaskPoolFactory::class)
            ->open(new PoolReference('tasks.named', null, [$third, $first, $second]), $this->builder)
            ->members();

        $this->assertSame(PoolMembersType::Ordered, $members->type);
        $this->assertSame([$third, $first, $second], $members->ids->ids);
    }

    public function test_a_named_pool_refuses_a_list_that_does_not_fit(): void
    {
        $factory = $this->app->make(NamedTaskPoolFactory::class);
        $task = Task::factory()->create()->id;

        $this->assertThrows(fn () => new PoolReference('tasks.named', null, [$task, $task]), InvalidRecordIds::class);
        $this->assertThrows(
            fn () => new PoolReference(
                'tasks.named',
                null,
                array_map(fn (int $number) => TestIds::of($number), range(1, 1001)),
            ),
            InvalidRecordIds::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('tasks.named', null, [$task, TestIds::of(99)]),
                $this->builder,
            ),
            TaskMissing::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(new PoolReference('tasks.named', null, []), $this->builder),
            TaskPoolRefused::class,
        );
        $this->assertThrows(
            fn () => $factory->validate(
                new PoolReference('tasks.named', new RecordIdentity('plans.plan', TestIds::of(40)), [$task]),
                $this->builder,
            ),
            TaskPoolRefused::class,
        );
    }

    public function test_a_named_pool_whose_task_went_missing_does_not_open(): void
    {
        $kept = Task::factory()->create()->id;
        $gone = Task::factory()->create();
        $reference = new PoolReference('tasks.named', null, [$kept, $gone->id]);
        $gone->delete();

        $this->expectException(TaskMissing::class);

        $this->app->make(NamedTaskPoolFactory::class)->open($reference, $this->builder);
    }
}
