<?php

declare(strict_types=1);

namespace Tests\Unit\Tools;

use Illuminate\Support\Facades\Process;
use Tests\TestCase;

/**
 * The index suggester: a query whose scopes no index serves gets the index it wants, equality columns first and the
 * order column last, and a query an index serves, or one only a foreign key covers, is told apart.
 */
final class ScopeIndexesTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/ScopeIndexes';

    public function test_a_query_no_index_serves_gets_its_index_and_a_served_one_is_left_out(): void
    {
        $run = Process::path(base_path())->run([
            PHP_BINARY,
            'tools/refactoring/scope-indexes.php',
            '--migrations='.self::FIXTURE.'/migrations',
            self::FIXTURE,
        ]);

        $this->assertTrue($run->successful(), $run->errorOutput());
        $this->assertSame(implode("\n", [
            'parcels:',
            '  index (carrier_id, delivered_at, created_at) for 1 query:',
            '    '.self::FIXTURE.'/ParcelQueue.php:19 Parcel::query()->ofCarrier()->undelivered()->newestFirst()->get()',
        ])."\n", $run->output());
    }
}
