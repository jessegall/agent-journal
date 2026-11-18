<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignedWorkProvider;
use App\Assignments\Contracts\AssignedWorkReader;
use App\Assignments\Contracts\AssignmentQuery;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Readers\RegisteredAssignedWork;
use App\Assignments\Registry\AssignmentRegistry;
use App\Assignments\Storage\DatabaseAssignmentQuery;
use App\Domains\Bootstrappers\RegisterAssignables;
use App\Domains\Support\DomainEntry;
use App\Records\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use RuntimeException;
use Tests\Fixtures\Domains\Errands\ErrandsDomain;
use Tests\Fixtures\Domains\Errands\ErrandWork;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The assignment subqueries a domain filters by hold exactly the current holdings of one type, for one holder or for
 * anyone, whoever is signed in; the work reader asks the type's registered provider and lets its failure through.
 */
final class AssignmentQueryTest extends TestCase
{
    use StartsAgentRequests;

    private ActorIdentity $builder;

    private ActorIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->builder = new ActorIdentity(ActorType::Agent, TestIds::of(7));
        $this->reviewer = new ActorIdentity(ActorType::Agent, TestIds::of(8));
        $this->startUserRequestAs(TestIds::of(1));
    }

    public function test_the_subqueries_select_the_held_and_the_assigned_ids_of_one_type(): void
    {
        [$first, $second, $third, $free] = $this->tasks(4);
        $this->hold($first, $this->builder);
        $this->hold($second, $this->builder);
        $this->hold($third, $this->reviewer);
        AssignmentRecord::holding(new RecordIdentity('plans.plan', TestIds::of(40)), $this->builder);

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

        $query = new DatabaseAssignmentQuery();

        $this->assertSame([$first], $query->heldIds(Task::LINK_TYPE, $this->builder)->pluck('record_id')->all());
        $this->assertSame([$first], $query->assignedIds(Task::LINK_TYPE)->pluck('record_id')->all());
    }

    public function test_the_work_reader_asks_the_registered_provider_and_lets_its_failure_through(): void
    {
        $registry = new AssignmentRegistry($this->app);
        new RegisterAssignables($registry)(DomainEntry::fromClass(ErrandsDomain::class));
        $reader = new RegisteredAssignedWork($registry);
        $this->app->scoped(ErrandWork::class, fn () => new class implements AssignedWorkProvider
        {
            public function countFor(ActorIdentity $holder): int
            {
                return $holder->id === TestIds::of(7) ? 3 : throw new RuntimeException('The count failed.');
            }
        });

        $this->assertInstanceOf(RegisteredAssignedWork::class, $this->app->make(AssignedWorkReader::class));
        $this->assertSame(3, $reader->count(ErrandsDomain::ERRAND, $this->builder));
        $this->assertThrows(
            fn () => $reader->count(ErrandsDomain::ERRAND, $this->reviewer),
            RuntimeException::class,
            'The count failed.',
        );
        $this->assertThrows(
            fn () => $reader->count('errands.unknown', $this->builder),
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

    private function hold(string $taskId, ActorIdentity $holder): AssignmentRecord
    {
        return AssignmentRecord::holding(new RecordIdentity(Task::LINK_TYPE, $taskId), $holder);
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
