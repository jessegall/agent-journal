<?php

declare(strict_types=1);

namespace Tests\Feature\Support;

use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\UsesSecondConnection;
use Tests\TestCase;

/**
 * A transaction a failed test leaves open on any connection is rolled back and its connection closed when the test
 * ends, so it never holds a lock the next test's table cleanup waits for.
 */
final class ClosedConnectionsTest extends TestCase
{
    use CommitsHookRows;
    use UsesSecondConnection;

    private const array TABLES = [];

    public function test_a_transaction_left_open_holds_its_lock_until_the_connections_close(): void
    {
        $other = $this->otherConnection();
        $other->beginTransaction();
        $other->statement('LOCK TABLE settings_records IN ACCESS EXCLUSIVE MODE');
        $pid = $other->selectOne('SELECT pg_backend_pid() AS pid')->pid;

        $this->assertSame(1, $this->locksHeldBy($pid));

        $this->closeConnections();

        $this->assertSame(0, $this->locksHeldBy($pid));
    }

    private function locksHeldBy(int $pid): int
    {
        return DB::connection()->selectOne(
            "SELECT count(*) AS held FROM pg_locks WHERE pid = ? AND relation = 'settings_records'::regclass",
            [$pid],
        )->held;
    }
}
