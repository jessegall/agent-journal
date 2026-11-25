<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An array of two or more entries puts each on its own line, unless it is the value of a local variable or a request's
 * validation rules. tools/refactoring/array-lines.php lists every other.
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

    public function test_arguments_returns_and_defaults_are_listed_and_local_values_and_rules_are_not(): void
    {
        $listed = array_map(
            fn (string $line) => (int) explode(':', explode("\t", $line)[0])[1],
            array_filter(explode("\n", $this->checkOutput(self::FIXTURE))),
        );

        $this->assertSame([13, 20, 25], array_values($listed));
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/array-lines.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
