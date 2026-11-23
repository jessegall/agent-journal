<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignedWorkProvider;
use App\Contracts\Assignments\AssignedWorkResolver;
use App\Contracts\Assignments\AssignmentQuery;
use App\Enums\ActorType;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Records\AssignmentRecord;
use App\Resolvers\RegisteredAssignedWork;
use App\Support\AssigneeIdentity;
use App\Support\Bootstrappers\RegisterAssignables;
use App\Support\DomainEntry;
use App\Support\RecordIdentity;
use App\Support\Registry\AssignmentRegistry;
use App\Support\Storage\DatabaseAssignmentQuery;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use RuntimeException;
use Tests\Fixtures\Domains\Errands\ErrandsDomain;
use Tests\Fixtures\Domains\Errands\ErrandWork;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The assignment subqueries a domain filters by hold exactly the current holdings of one type, for one holder or for
 * anyone, whoever is signed in; the work reader asks the type's registered provider and lets its failure through.
 */
final class AssignmentQueryTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string COUNT_FAILED = 'The count failed.';

    private AssigneeIdentity $builder;

    private AssigneeIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = new AssigneeIdentity(ActorType::Agent->value, TestIds::of(7));
        $this->reviewer = new AssigneeIdentity(ActorType::Agent->value, TestIds::of(8));
        $this->startTestUserRequest(1);
    }

    public function test_the_subqueries_select_the_held_and_the_assigned_ids_of_one_type(): void
    {
        [$first, $second, $third, $free] = $this->tasks(4);
        $this->hold($first, $this->builder);
        $this->hold($second, $this->builder);
        $this->hold($third, $this->reviewer);
        AssignmentRecord::create(TestActors::record('plans.plan', 40), $this->builder);

        $query = $this->app->make(AssignmentQuery::class);

        $this->assertInstanceOf(DatabaseAssignmentQuery::class, $query);
        $this->assertSame(
            self::sorted([$first, $second]),
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->heldIds(Task::LINK_TYPE, $this->builder))),
        );
        $this->assertSame(
            self::sorted([$first, $second, $third]),
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->assignedIds(Task::LINK_TYPE))),
        );
        $this->assertSame(
            [$free],
            $this->taskIds(fn ($tasks) => $tasks->whereNotIn('id', $query->assignedIds(Task::LINK_TYPE))),
        );
    }

    public function test_a_released_assignment_leaves_the_subqueries(): void
    {
        [$first, $second] = $this->tasks(2);
        $this->hold($first, $this->builder);
        $this->hold($second, $this->builder)->delete();

        $query = $this->app->make(AssignmentQuery::class);

        $this->assertSame(
            [$first],
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->heldIds(Task::LINK_TYPE, $this->builder))),
        );
        $this->assertSame(
            [$first],
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->assignedIds(Task::LINK_TYPE))),
        );
    }

    public function test_the_subqueries_see_holdings_with_nobody_signed_in(): void
    {
        [$first] = $this->tasks(1);
        $this->hold($first, $this->builder);
        $this->app->make(CurrentActorSetter::class)->clear();

        $query = $this->app->make(DatabaseAssignmentQuery::class);

        $this->assertSame([$first], $query->heldIds(Task::LINK_TYPE, $this->builder)->pluck('record_id')->all());
        $this->assertSame([$first], $query->assignedIds(Task::LINK_TYPE)->pluck('record_id')->all());
    }

    public function test_the_work_reader_asks_the_registered_provider_and_lets_its_failure_through(): void
    {
        $registry = new AssignmentRegistry();
        new RegisterAssignables($registry)(DomainEntry::fromClass(ErrandsDomain::class));
        $resolver = new RegisteredAssignedWork($registry);
        $this->app->scoped(ErrandWork::class, fn () => new class implements AssignedWorkProvider
        {
            public function countFor(AssigneeIdentity $holder): int
            {
                return $holder->id === TestIds::of(7) ? 3 : throw SimulatedFailure::of('The count failed.');
            }
        });

        $this->assertInstanceOf(RegisteredAssignedWork::class, $this->app->make(AssignedWorkResolver::class));
        $this->assertSame(3, $resolver->count(ErrandsDomain::ERRAND, $this->builder));
        $this->assertThrows(
            fn () => $resolver->count(ErrandsDomain::ERRAND, $this->reviewer),
            RuntimeException::class,
            self::COUNT_FAILED,
        );
        $this->assertThrows(
            fn () => $resolver->count('errands.unknown', $this->builder),
            AssignmentTypeUnavailable::class,
        );
    }

    /**
     * @return list<string>
     */
    private function tasks(int $count): array
    {
        return array_map(fn () => Task::factory()->create()->id, range(1, $count));
    }

    private function hold(string $taskId, AssigneeIdentity $holder): AssignmentRecord
    {
        return AssignmentRecord::create(new RecordIdentity(Task::LINK_TYPE, $taskId), $holder);
    }

    /**
     * @param  callable(Builder<Task>): mixed  $filter
     * @return list<string>
     */
    private function taskIds(callable $filter): array
    {
        $tasks = Task::query()->orderBy('id');
        $filter($tasks);

        return array_values($tasks->readAll('the test reads every task it made')->pluck('id')->all());
    }

    /**
     * @param  list<string>  $ids
     * @return list<string>
     */
    private static function sorted(array $ids): array
    {
        sort($ids);

        return $ids;
    }
}
