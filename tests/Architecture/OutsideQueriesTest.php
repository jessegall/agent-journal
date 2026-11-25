<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Outside its own model, a query chains only the model's scopes and then a read, so every way a model is filtered or
 * ordered is named on the model (user message 22197). tools/refactoring/outside-queries.php lists every other.
 */
final class OutsideQueriesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Filter and order each through a scope of its model: ';

    private const string FIXTURE = 'tests/Fixtures/OutsideQueries';

    public function test_no_query_filters_or_orders_outside_its_model(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_raw_filter_or_order_from_outside_is_listed_and_scopes_key_reads_and_the_models_own_are_not(): void
    {
        preg_match_all('/\tquery of \S+ calls (\w+)/', $this->checkOutput(self::FIXTURE), $listed);

        $this->assertSame(['where', 'orderBy'], $listed[1]);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/outside-queries.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
