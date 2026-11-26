<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ToolCheck;

/**
 * A model or an Eloquent cast never writes or reads a column's JSON by hand: a column holding an object or a list of
 * them is cast to its Laravel Data class, and Laravel Data reads and writes it.
 * tools/refactoring/column-json.php lists every other.
 */
final class ColumnJsonTest extends TestCase
{
    private const string HOW_TO_FIX = 'Cast the column to its Data class instead of encoding it by hand: ';

    private const string FIXTURE = 'tests/Fixtures/ColumnJson';

    public function test_no_model_or_cast_writes_a_column_as_json_by_hand(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_hand_json_is_listed_and_digests_and_plain_classes_are_not(): void
    {
        preg_match_all('#ColumnJson/(\w+)\.php:(\d+)\t#', $this->checkOutput(self::FIXTURE), $found, PREG_SET_ORDER);

        $this->assertSame(
            ['Receipt:21', 'ReceiptLinesCast:23'],
            array_map(fn (array $match) => "{$match[1]}:{$match[2]}", $found),
        );
    }

    private function checkOutput(string ...$paths): string
    {
        $check = ToolCheck::run([PHP_BINARY, 'tools/refactoring/column-json.php', ...$paths]);

        return $check->output();
    }
}
