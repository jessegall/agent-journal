<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * A model's Attribute accessor is read by its snake case name, as the generated @property block names it, never by its
 * camel case method name, though Laravel resolves both (user messages 22269 and 22270).
 * tools/refactoring/accessor-reads.php lists every other.
 */
final class AccessorReadsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Read each accessor by its snake case name: ';

    private const string FIXTURE = 'tests/Fixtures/AccessorReads';

    public function test_no_accessor_is_read_by_its_camel_case_name(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_camel_case_reads_are_listed_and_snake_case_reads_are_not(): void
    {
        preg_match_all('#AccessorReads/(\w+)\.php:(\d+)\t#', $this->checkOutput(self::FIXTURE), $found, PREG_SET_ORDER);

        $this->assertSame(
            ['Parcel:20', 'ParcelDesk:15'],
            array_map(fn (array $match) => "{$match[1]}:{$match[2]}", $found),
        );
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/accessor-reads.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
