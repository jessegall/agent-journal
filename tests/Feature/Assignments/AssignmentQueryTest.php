<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentQuery as AssignmentQueryContract;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\Eloquent\Builder;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The assignment subqueries a domain filters by hold exactly the current holdings of one type, for one holder or for
 * anyone, whoever is signed in; the work reader asks the type's registered provider and lets its failure through.
 */
final class AssignmentQueryTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private AssigneeIdentity $builder;

    private AssigneeIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->builder = new AssigneeIdentity(Agent::storedType(), TestIds::of(7));
        $this->reviewer = new AssigneeIdentity(Agent::storedType(), TestIds::of(8));
        $this->journal->actAsUserId(TestIds::of(1));
    }

    public function test_a_released_assignment_leaves_the_subqueries(): void
    {
        [$first, $second] = $this->tasks(2);
        $this->hold($first, $this->builder);
        $this->hold($second, $this->builder)->delete();

        $query = $this->app->make(AssignmentQueryContract::class);

        $this->assertSame(
            [$first],
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->heldIds(Task::linkType(), $this->builder))),
        );
        $this->assertSame(
            [$first],
            $this->taskIds(fn ($tasks) => $tasks->whereIn('id', $query->assignedIds(Task::linkType()))),
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
        return AssignmentRecord::create(new RecordIdentity(Task::linkType(), $taskId), $holder);
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
}
