<?php

declare(strict_types=1);

namespace Tests\Unit\Testing;

use Tests\TestCase;

require_once __DIR__.'/../../bin/test-runs.php';

/**
 * A test run starts one worker for its first 25 tests and one more for each 25 after them, at most eight, so a rerun
 * of a few failed tests costs one worker's start.
 */
final class TestWorkersTest extends TestCase
{
    public function test_a_run_starts_one_worker_for_each_twenty_five_tests_it_runs(): void
    {
        $folder = sys_get_temp_dir().'/test-workers-'.bin2hex(random_bytes(6));
        mkdir($folder);
        file_put_contents("{$folder}/ManyTest.php", implode("\n", array_map(fn (int $number) => "function test_case_{$number}() {}", range(1, 60))));

        $this->journal->assertResult(
            [1, 1, 3, 2, 5],
            [
                processesFor($folder, ['--filter=test_case_1$'], ['ManyTest.php']),
                processesFor($folder, ['--filter=test_case_(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25)$'], ['ManyTest.php']),
                processesFor($folder, [], ['ManyTest.php']),
                processesFor($folder, ['--filter=test_case_[1-4]\d?$'], ['ManyTest.php']),
                processesFor($folder, ['--processes=5'], ['ManyTest.php']),
            ],
        );
    }
}
