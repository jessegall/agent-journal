<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AutoAssignmentReader;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Exceptions\AutoAssignmentMissing;
use App\Assignments\Exceptions\AutoAssignmentPoolUnreadable;
use App\Assignments\Exceptions\AutoAssignmentRevisionChanged;
use App\Assignments\Exceptions\AutoAssignmentSizeInvalid;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\Page;
use App\Assignments\Support\PoolReference;
use App\Records\Support\RecordIdentity;
use Closure;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The stored auto-assignment of an actor and a type: enabled first at revision 1, changed only against the current
 * revision and moved on only when something changed, kept with its pool and size when off, and refused when its pool
 * column no longer reads.
 */
final class AutoAssignmentStorageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['auto_assignments'];

    private AutoAssignmentKey $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->key = new AutoAssignmentKey(new ActorIdentity(ActorType::Agent, TestIds::of(7)), 'tasks.task');
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

        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 2), 0));

        $row = (array) DB::table('auto_assignments')->sole();

        $this->expectException(UniqueConstraintViolationException::class);

        DB::table('auto_assignments')->insert(['id' => strtolower((string) Str::ulid())] + $row);
    }

    public function test_the_first_enable_creates_revision_one(): void
    {
        $this->assertTrue($this->reader()->forActor($this->key)->isEmpty());

        $change = $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 2), 0));

        $this->assertEquals(new AutoAssignmentChange(true, 1), $change);
        $fact = $this->fact();
        $this->assertTrue($fact->enabled);
        $this->assertSame(2, $fact->size);
        $this->assertTrue($fact->pool->isSameAs(self::open()));
        $this->assertNull($fact->lastServedAt);
    }

    public function test_a_stale_revision_fails_and_changes_nothing_even_for_the_same_values(): void
    {
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 2), 0));

        $this->assertThrows(
            fn () => $this->write(
                fn (AutoAssignmentWriter $writer) => $writer->configure($this->input(self::open(), 2), 0),
            ),
            AutoAssignmentRevisionChanged::class,
        );
        $this->assertThrows(
            fn () => $this->write(
                fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 5), 3),
            ),
            AutoAssignmentRevisionChanged::class,
        );
        $this->assertSame(1, $this->fact()->revision);
        $this->assertSame(2, $this->fact()->size);
    }

    public function test_pool_and_size_changed_together_move_one_revision_and_the_same_values_none(): void
    {
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 2), 0));
        $named = new PoolReference('tasks.named', null, [TestIds::of(3), TestIds::of(1)]);

        $changed = $this->write(fn (AutoAssignmentWriter $writer) => $writer->configure($this->input($named, 4), 1));
        $same = $this->write(fn (AutoAssignmentWriter $writer) => $writer->configure($this->input($named, 4), 2));

        $this->assertEquals(new AutoAssignmentChange(true, 2), $changed);
        $this->assertEquals(new AutoAssignmentChange(false, 2), $same);
        $this->assertSame([TestIds::of(3), TestIds::of(1)], $this->fact()->pool->recordIds);
        $this->assertSame(4, $this->fact()->size);
    }

    public function test_disable_keeps_the_pool_and_size_and_a_missing_one_is_off_at_revision_zero(): void
    {
        $plan = new PoolReference('plans.tasks', new RecordIdentity('plans.plan', TestIds::of(40)), []);

        $this->assertEquals(
            new AutoAssignmentChange(false, 0),
            $this->write(fn (AutoAssignmentWriter $writer) => $writer->disable($this->key, 0)),
        );
        $this->assertTrue($this->reader()->forActor($this->key)->isEmpty());
        $this->assertThrows(
            fn () => $this->write(
                fn (AutoAssignmentWriter $writer) => $writer->configure($this->input($plan, 3), 0),
            ),
            AutoAssignmentMissing::class,
        );

        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input($plan, 3), 0));
        $off = $this->write(fn (AutoAssignmentWriter $writer) => $writer->disable($this->key, 1));

        $this->assertEquals(new AutoAssignmentChange(true, 2), $off);
        $this->assertFalse($this->fact()->enabled);
        $this->assertTrue($this->fact()->pool->isSameAs($plan));
        $this->assertSame(3, $this->fact()->size);
    }

    public function test_the_enabled_page_holds_only_enabled_facts_by_id(): void
    {
        foreach (range(1, 3) as $number) {
            $key = new AutoAssignmentKey(new ActorIdentity(ActorType::Agent, TestIds::of($number)), 'tasks.task');
            $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable(
                new AutoAssignmentInput($key, self::open(), 1),
                0,
            ));
        }
        $off = new AutoAssignmentKey(new ActorIdentity(ActorType::Agent, TestIds::of(2)), 'tasks.task');
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->disable($off, 1));

        $first = $this->reader()->enabled(new Page(null, 1));
        $second = $this->reader()->enabled(new Page($first->nextAfterId, 1));

        $this->assertCount(1, $first->facts);
        $this->assertNotNull($first->nextAfterId);
        $this->assertCount(1, $second->facts);
        $this->assertNull($second->nextAfterId);
        $this->assertSame(
            [TestIds::of(1), TestIds::of(3)],
            self::sorted([$first->facts[0]->key->actor->id, $second->facts[0]->key->actor->id]),
        );
        $this->assertCount(1, $this->reader()->listFor($off->actor, new Page())->facts);
    }

    public function test_a_size_outside_one_to_a_hundred_is_refused(): void
    {
        $this->assertThrows(fn () => $this->input(self::open(), 0), AutoAssignmentSizeInvalid::class);
        $this->assertThrows(fn () => $this->input(self::open(), 101), AutoAssignmentSizeInvalid::class);
    }

    public function test_a_change_outside_the_bus_transaction_is_refused(): void
    {
        $this->expectException(AssignmentTransactionRequired::class);

        $this->app->make(AutoAssignmentWriter::class)->enable($this->input(self::open(), 1), 0);
    }

    public function test_a_corrupt_pool_column_is_a_named_failure_not_a_default_pool(): void
    {
        $this->write(fn (AutoAssignmentWriter $writer) => $writer->enable($this->input(self::open(), 1), 0));
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
     * @param  Closure(AutoAssignmentWriter): AutoAssignmentChange  $work
     */
    private function write(Closure $work): AutoAssignmentChange
    {
        return $this->app->make(AssignmentTransaction::class)
            ->run(fn () => $work($this->app->make(AutoAssignmentWriter::class)));
    }

    private function reader(): AutoAssignmentReader
    {
        return $this->app->make(AutoAssignmentReader::class);
    }

    private function fact(): AutoAssignmentFact
    {
        return $this->reader()->forActor($this->key)->get();
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
