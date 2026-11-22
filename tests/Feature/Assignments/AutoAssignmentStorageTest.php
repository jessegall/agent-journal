<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Assignments\AutoAssignmentWriter;
use App\Contracts\Time\ServerClock;
use App\Enums\AutoAssignmentClaimType;
use App\Exceptions\AssignmentTransactionRequired;
use App\Exceptions\AutoAssignmentMissing;
use App\Exceptions\AutoAssignmentPoolUnreadable;
use App\Exceptions\AutoAssignmentRevisionChanged;
use App\Exceptions\AutoAssignmentSizeInvalid;
use App\Models\AutoAssignment;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentOutcome;
use App\Support\Page;
use App\Support\PoolReference;
use App\Support\Storage\DatabaseAutoAssignments;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The stored auto-assignment of an actor and a type: enabled first at revision 1, changed only against the current
 * revision and moved on only when something changed, kept with its pool and size when off, and refused when its pool
 * column does not read.
 */
final class AutoAssignmentStorageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['auto_assignments'];

    private AutoAssignmentKey $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->key = new AutoAssignmentKey(TestActors::agentIdentity(7), 'tasks.task');
    }

    public function test_the_table_keeps_one_row_per_actor_and_type(): void
    {
        $this->assertTrue(Schema::hasTable('auto_assignments'));
        $this->assertTrue(Schema::hasColumns('auto_assignments', [
            'actor_type',
            'actor_id',
            'assignable_type',
            'enabled',
            'pool',
            'size',
            'configuration_revision',
            'last_served_at',
        ]));
        $this->assertFalse(Schema::hasColumn('auto_assignments', 'session_id'));

        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 2), 0));

        $row = AutoAssignment::query()->sole()->getAttributes();

        $this->expectException(UniqueConstraintViolationException::class);

        DB::table('auto_assignments')->insert(['id' => strtolower((string) Str::ulid())] + $row);
    }

    public function test_the_first_enable_creates_revision_one(): void
    {
        $this->assertTrue($this->resolver()->forActor($this->key)->isEmpty());

        $change = $this->write(
            fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 2), 0),
        );

        $this->assertEquals(new AutoAssignmentChange(true, 1), $change);
        $fact = $this->fact();
        $this->assertTrue($fact->enabled);
        $this->assertSame(2, $fact->size);
        $this->assertTrue($fact->pool->isSameAs(self::open()));
        $this->assertNull($fact->lastServedAt);
    }

    public function test_a_stale_revision_fails_and_changes_nothing_even_for_the_same_values(): void
    {
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 2), 0));

        $this->assertThrows(
            fn () => $this->write(
                fn (DatabaseAutoAssignments $writer) => $writer->configure($this->input(self::open(), 2), 0),
            ),
            AutoAssignmentRevisionChanged::class,
        );
        $this->assertThrows(
            fn () => $this->write(
                fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 5), 3),
            ),
            AutoAssignmentRevisionChanged::class,
        );
        $this->assertSame(1, $this->fact()->revision);
        $this->assertSame(2, $this->fact()->size);
    }

    public function test_pool_and_size_changed_together_move_one_revision_and_the_same_values_none(): void
    {
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 2), 0));
        $named = new PoolReference('tasks.named', null, [TestIds::of(3), TestIds::of(1)]);

        $changed = $this->write(fn (DatabaseAutoAssignments $writer) => $writer->configure($this->input($named, 4), 1));
        $same = $this->write(fn (DatabaseAutoAssignments $writer) => $writer->configure($this->input($named, 4), 2));

        $this->assertEquals(new AutoAssignmentChange(true, 2), $changed);
        $this->assertEquals(new AutoAssignmentChange(false, 2), $same);
        $this->assertSame([TestIds::of(3), TestIds::of(1)], $this->fact()->pool->recordIds);
        $this->assertSame(4, $this->fact()->size);
    }

    public function test_disable_keeps_the_pool_and_size_and_a_missing_one_is_off_at_revision_zero(): void
    {
        $plan = new PoolReference('plans.tasks', TestActors::record('plans.plan', 40), []);

        $this->assertEquals(
            new AutoAssignmentChange(false, 0),
            $this->write(fn (DatabaseAutoAssignments $writer) => $writer->disable($this->key, 0)),
        );
        $this->assertTrue($this->resolver()->forActor($this->key)->isEmpty());
        $this->assertThrows(
            fn () => $this->write(
                fn (DatabaseAutoAssignments $writer) => $writer->configure($this->input($plan, 3), 0),
            ),
            AutoAssignmentMissing::class,
        );

        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input($plan, 3), 0));
        $off = $this->write(fn (DatabaseAutoAssignments $writer) => $writer->disable($this->key, 1));

        $this->assertEquals(new AutoAssignmentChange(true, 2), $off);
        $this->assertFalse($this->fact()->enabled);
        $this->assertTrue($this->fact()->pool->isSameAs($plan));
        $this->assertSame(3, $this->fact()->size);
    }

    public function test_the_enabled_page_holds_only_enabled_facts_by_id(): void
    {
        foreach (range(1, 3) as $number) {
            $key = new AutoAssignmentKey(TestActors::agentIdentity($number), 'tasks.task');
            $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable(
                new AutoAssignmentInput($key, self::open(), 1),
                0,
            ));
        }

        $off = new AutoAssignmentKey(TestActors::agentIdentity(2), 'tasks.task');
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->disable($off, 1));

        $first = $this->resolver()->enabled(new Page(null, 1));
        $second = $this->resolver()->enabled(new Page($first->nextAfterId, 1));

        $this->assertCount(1, $first->facts);
        $this->assertNotNull($first->nextAfterId);
        $this->assertCount(1, $second->facts);
        $this->assertNull($second->nextAfterId);
        $this->assertSame(
            [TestIds::of(1), TestIds::of(3)],
            self::sorted([$first->facts[0]->key->actor->id, $second->facts[0]->key->actor->id]),
        );
        $this->assertCount(1, $this->resolver()->listFor($off->actor, new Page())->facts);
    }

    public function test_a_size_outside_one_to_a_hundred_is_refused(): void
    {
        $this->assertThrows(fn () => $this->input(self::open(), 0), AutoAssignmentSizeInvalid::class);
        $this->assertThrows(fn () => $this->input(self::open(), 101), AutoAssignmentSizeInvalid::class);
    }

    public function test_a_change_outside_the_bus_transaction_is_refused(): void
    {
        $this->expectException(AssignmentTransactionRequired::class);

        $this->app->make(DatabaseAutoAssignments::class)->enable($this->input(self::open(), 1), 0);
    }

    public function test_claim_skips_the_callback_when_the_row_is_missing_or_off(): void
    {
        $claim = fn () => $this->fail('An off configuration should not call the claim.');
        $this->assertSame(AutoAssignmentClaimType::Off, $this->claim($claim)->type);
        $this->assertSame(0, AutoAssignment::query()->count());
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 1), 0));
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->disable($this->key, 1));

        $this->assertSame(AutoAssignmentClaimType::Off, $this->claim($claim)->type);
        $this->assertNull($this->fact()->lastServedAt);
    }

    public function test_an_assigned_claim_forces_a_row_update_even_at_the_same_time(): void
    {
        $now = CarbonImmutable::parse('2026-11-20 12:00:00 UTC');
        $this->mock(ServerClock::class)->shouldReceive('now')->twice()->andReturn($now);
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 1), 0));
        $record = TestActors::record('tasks.task', 3);
        $connection = $this->app->make(DatabaseManager::class)->connection();
        $connection->enableQueryLog();

        try {
            $claim = fn () => AutoAssignmentOutcome::assigned($record);
            $this->assertEquals($record, $this->claim($claim)->record);
            $this->assertEquals($record, $this->claim($claim)->record);
            $updates = array_filter(
                $connection->getQueryLog(),
                fn (array $query) => str_starts_with($query['query'], 'update "auto_assignments"'),
            );
            $this->assertCount(2, $updates);
        } finally {
            $connection->disableQueryLog();
        }

        $this->assertEquals($now, $this->fact()->lastServedAt);
        $this->assertSame(1, $this->fact()->revision);
    }

    public function test_unfilled_claims_and_callback_failure_leave_service_time_unchanged(): void
    {
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 1), 0));
        $this->assertSame(AutoAssignmentClaimType::Full, $this->claim(AutoAssignmentOutcome::full(...))->type);
        $this->assertSame(
            AutoAssignmentClaimType::NoCandidate,
            $this->claim(AutoAssignmentOutcome::noCandidate(...))->type,
        );
        $this->assertThrows(
            fn () => $this->claim(fn () => throw AutoAssignmentMissing::forKey($this->key)),
            AutoAssignmentMissing::class,
        );

        $this->assertNull($this->fact()->lastServedAt);
        $this->assertSame(1, $this->fact()->revision);
    }

    /**
     * @param  Closure(AutoAssignmentFact): AutoAssignmentOutcome  $claim
     */
    private function claim(Closure $claim): AutoAssignmentOutcome
    {
        return $this->app->make(AssignmentTransaction::class)
            ->run(fn () => $this->app->make(AutoAssignmentWriter::class)->claim($this->key, $claim));
    }

    public function test_a_corrupt_pool_column_is_a_named_failure_not_a_default_pool(): void
    {
        $this->write(fn (DatabaseAutoAssignments $writer) => $writer->enable($this->input(self::open(), 1), 0));
        DB::table('auto_assignments')->update(['pool' => json_encode(['type' => 'tasks.open'])]);

        $this->expectException(AutoAssignmentPoolUnreadable::class);

        $this->fact();
    }

    private function input(PoolReference $pool, int $size): AutoAssignmentInput
    {
        return new AutoAssignmentInput($this->key, $pool, $size);
    }

    private static function open(): PoolReference
    {
        return new PoolReference('tasks.open', null, []);
    }

    /**
     * @param  Closure(DatabaseAutoAssignments): AutoAssignmentChange  $work
     */
    private function write(Closure $work): AutoAssignmentChange
    {
        return $this->app->make(AssignmentTransaction::class)
            ->run(fn () => $work($this->app->make(DatabaseAutoAssignments::class)));
    }

    private function resolver(): AutoAssignmentResolver
    {
        return $this->app->make(AutoAssignmentResolver::class);
    }

    private function fact(): AutoAssignmentFact
    {
        return $this->resolver()->forActor($this->key)->get();
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
