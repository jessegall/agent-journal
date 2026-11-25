<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Exceptions\AssignmentTransactionRequired;
use App\Exceptions\AutoAssignmentSizeInvalid;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use App\Support\Storage\DatabaseAutoAssignments;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The stored auto-assignment of an actor and a type: enabled first at revision 1, changed only against the current
 * revision and moved on only when something changed, kept with its pool and size when off, and refused when its pool
 * column does not read.
 */
final class AutoAssignmentStorageTest extends TestCase
{
    private AutoAssignmentKey $key;

    protected function setUp(): void
    {
        parent::setUp();

        $this->key = new AutoAssignmentKey(TestActors::agentIdentity(7), 'tasks.task');
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

    private function input(PoolReference $pool, int $size): AutoAssignmentInput
    {
        return new AutoAssignmentInput($this->key, $pool, $size);
    }

    private static function open(): PoolReference
    {
        return new PoolReference('tasks.open', null, []);
    }
}
