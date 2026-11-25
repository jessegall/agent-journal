<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * tools/refactoring/test-overlap.php lists tests that rest on near-identical facts and tests a command test already
 * covers, each with its score, so a removal is a calculated choice (rule 104).
 */
final class TestOverlapTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/TestOverlap';

    public function test_two_tests_on_the_same_facts_overlap_and_a_test_inside_a_command_test_is_covered(): void
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/test-overlap.php', self::FIXTURE], base_path());
        $check->run();
        $lines = array_map(fn (string $line) => explode("\t", $line), explode("\n", trim($check->getOutput())));

        $this->assertSame([
            ['overlap', '1.00', 'test_a_stacked_book_is_on_the_shelf', 'test_a_stacked_book_is_the_only_one'],
            [
                'covered',
                '0.67',
                'test_a_lent_book_leaves_the_shelf',
                'test_lending_takes_the_book_off_the_shelf_and_records_the_loan',
            ],
        ], array_map(fn (array $line) => [$line[0], $line[1], self::method($line[2]), self::method($line[3])], $lines));
    }

    private static function method(string $test): string
    {
        return substr($test, strrpos($test, '::') + 2);
    }
}
