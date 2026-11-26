<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ToolCheck;

/**
 * A model writes a row one way, assigning each column as a property and saving, never through an array, so the
 * property types check every column and no fillable list is needed.
 * tools/refactoring/array-writes.php lists every other.
 */
final class ArrayWritesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Assign each column as a property and save: ';

    private const string FIXTURE = 'tests/Fixtures/ArrayWrites';

    public function test_no_model_writes_a_row_through_an_array(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_array_writes_are_listed_and_property_writes_mass_updates_and_values_are_not(): void
    {
        preg_match_all('/Ticket\.php:(\d+)\t/', $this->checkOutput(self::FIXTURE), $lines);

        $this->assertSame(['20', '25', '30', '49'], $lines[1]);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = ToolCheck::run([PHP_BINARY, 'tools/refactoring/array-writes.php', ...$paths]);

        return $check->output();
    }
}
