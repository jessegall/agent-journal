<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * No row read is passed straight into another call and no null-safe call hangs on another call's result: the inner
 * result is bound first, and missing is handled before acting.
 * tools/refactoring/nested-calls.php lists every such nesting.
 */
final class NestedCallsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Bind the inner result to a variable, leave early when it is missing, then act: ';

    private const string FIXTURE = 'tests/Fixtures/NestedCalls';

    public function test_no_call_nests_a_row_read_or_hangs_on_a_call(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_nested_read_and_a_chained_lookup_are_listed_and_bound_ones_and_subqueries_are_not(): void
    {
        preg_match_all('#NestedCalls/(\w+)\.php:(\d+)\t#', $this->checkOutput(self::FIXTURE), $found, PREG_SET_ORDER);

        $this->assertSame(
            ['ParcelDesk:14', 'ParcelDesk:19'],
            array_map(fn (array $match) => "{$match[1]}:{$match[2]}", $found),
        );
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, '-d', 'memory_limit=4G', 'tools/refactoring/nested-calls.php', ...$paths], base_path());
        $check->setTimeout(300);
        $check->run();

        return $check->getOutput();
    }
}
