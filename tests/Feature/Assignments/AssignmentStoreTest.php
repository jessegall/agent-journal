<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssigneeIdentity;
use App\Records\Support\RecordIdentity;
use Exception;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use PDOException;
use ReflectionProperty;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;

/**
 * The store of current assignments in its repeatable-read transaction: one holder per record, a new row for each
 * reassignment so an old reference never matches again, a race on an unheld record settled by running the work again,
 * and no rows for a request with nobody acting.
 */
final class AssignmentStoreTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use UsesSecondConnection;

    private const array TABLES = ['assignments'];

    private RecordIdentity $task;

    private AssigneeIdentity $builder;

    private AssigneeIdentity $reviewer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->task = TestActors::record('tasks.task', 12);
        $this->builder = new AssigneeIdentity(ActorType::Agent->value, TestIds::of(7));
        $this->reviewer = new AssigneeIdentity(ActorType::Agent->value, TestIds::of(8));
        $this->startTestUserRequest(1);
    }

    public function test_an_unheld_record_gets_one_holder_and_a_second_assign_finds_it(): void
    {
        $first = $this->inTransaction(
            fn (AssignmentStore $store) => $store->assignIfUnheld($this->task, $this->builder),
        );
        $second = $this->inTransaction(
            fn (AssignmentStore $store) => $store->assignIfUnheld($this->task, $this->reviewer),
        );

        $this->assertTrue($second->reference->isSameAs($first->reference));
        $this->assertSame(1, AssignmentRecord::query()->count());
    }

    public function test_a_reassignment_back_to_the_first_holder_does_not_match_the_first_reference(): void
    {
        $first = $this->inTransaction(
            fn (AssignmentStore $store) => $store->assignIfUnheld($this->task, $this->builder),
        );
        $toReviewer = $this->inTransaction(fn (AssignmentStore $store) => $store->replace($first, $this->reviewer));
        $back = $this->inTransaction(fn (AssignmentStore $store) => $store->replace($toReviewer, $this->builder));

        $this->assertTrue($back->holder()->isSameAs($first->holder()));
        $this->assertFalse($back->reference->isSameAs($first->reference));
        $this->assertSame(
            $back->reference->id,
            $this->inTransaction(fn (AssignmentStore $store) => $store->lockCurrent($this->task)->get()->reference->id),
        );
    }

    public function test_releasing_an_actor_removes_only_its_rows_and_reports_each_change(): void
    {
        $plan = TestActors::record('plans.plan', 3);
        $this->inTransaction(fn (AssignmentStore $store) => $store->assignIfUnheld($this->task, $this->builder));
        $this->inTransaction(fn (AssignmentStore $store) => $store->assignIfUnheld($plan, $this->builder));
        $kept = $this->inTransaction(
            fn (AssignmentStore $store) => $store->assignIfUnheld(
                TestActors::record('tasks.task', 13),
                $this->reviewer,
            ),
        );

        $result = $this->inTransaction(fn (AssignmentStore $store) => $store->releaseAll($this->builder));

        $this->assertCount(2, $result->changes);
        $this->assertNull($result->changes[0]->after);
        $this->assertSame([$kept->reference->id], AssignmentRecord::query()->pluck('id')->all());
    }

    public function test_the_store_refuses_work_outside_a_transaction_or_in_another_isolation(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(AssignmentStore::class)->lockCurrent($this->task),
            AssignmentTransactionRequired::class,
        );

        DB::transaction(function (): void {
            $this->assertThrows(
                fn () => $this->app->make(AssignmentTransaction::class)->run(fn () => true),
                AssignmentTransactionRequired::class,
            );
        });
    }

    public function test_a_winner_this_snapshot_cannot_see_runs_the_work_again_and_finds_it(): void
    {
        $other = $this->otherConnection();
        $attempts = 0;

        $assignment = $this->app->make(AssignmentTransaction::class)->run(function () use (&$attempts, $other) {
            $attempts++;
            $store = $this->app->make(AssignmentStore::class);
            $store->lockCurrent(TestActors::record('tasks.task', 99));

            if ($attempts === 1) {
                $other->table('assignments')->insert(
                    [
                        'id' => strtolower((string) Str::ulid()),
                        'record_type' => 'tasks.task',
                        'record_id' => $this->task->id,
                        'holder_type' => 'agent',
                        'holder_id' => $this->reviewer->id,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }

            return $store->assignIfUnheld($this->task, $this->builder);
        });

        $this->assertSame(2, $attempts);
        $this->assertTrue($assignment->holder()->isSameAs($this->reviewer));
    }

    public function test_three_conflicts_in_a_row_give_up(): void
    {
        $attempts = 0;
        $conflict = new PDOException('could not serialize access');
        new ReflectionProperty(Exception::class, 'code')->setValue($conflict, '40001');

        $this->expectException(AssignmentRetryExhausted::class);

        try {
            $this->app->make(AssignmentTransaction::class)->run(function () use (&$attempts, $conflict): never {
                $attempts++;

                throw new QueryException('pgsql', 'select 1', [], $conflict);
            });
        } finally {
            $this->assertSame(3, $attempts);
        }
    }

    public function test_a_request_with_nobody_acting_sees_no_assignment_but_retirement_does(): void
    {
        $this->inTransaction(fn (AssignmentStore $store) => $store->assignIfUnheld($this->task, $this->builder));

        $this->app->forgetScopedInstances();

        $this->assertSame(0, AssignmentRecord::query()->count());
        $this->assertSame(1, AssignmentRecord::query()->heldForRetirement($this->builder)->count());
    }

    /**
     * @template TResult
     *
     * @param  \Closure(AssignmentStore): TResult  $work
     * @return TResult
     */
    private function inTransaction(\Closure $work): mixed
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $work($this->app->make(AssignmentStore::class)),
        );
    }
}
