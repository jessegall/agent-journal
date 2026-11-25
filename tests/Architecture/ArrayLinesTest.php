<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An array of two or more entries puts each on its own line, unless it is the value of a local variable (user messages
 * 22073, 22083 and 22085). tools/refactoring/array-lines.php lists every other, and --fix splits them.
 */
#[TimeLimit(seconds: 90, reason: 'It parses every PHP file of app, domain and tools.')]
final class ArrayLinesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Split each with php tools/refactoring/array-lines.php --fix, then Pint: ';

    private const string FIXTURE = 'tests/Fixtures/ArrayLines/CrampedArrays.php';

    public function test_every_array_puts_each_entry_on_its_own_line(): void
    {
        $output = $this->checkOutput('app', 'domain', 'tools');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_an_argument_a_return_and_a_property_default_are_listed_and_a_local_value_is_not(): void
    {
        $listed = array_map(
            fn (string $line) => (int) explode(':', explode("\t", $line)[0])[1],
            array_filter(explode("\n", $this->checkOutput(self::FIXTURE))),
        );

        $this->assertSame([12, 19, 24], array_values($listed));
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/array-lines.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
