<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * A model column whose items are not plain scalars is cast to Laravel Data, the Data class or a collection of one,
 * never to an array of shapes. tools/refactoring/array-casts.php lists every other.
 */
final class ArrayCastsTest extends TestCase
{
    private const string UNTYPED_NOTES = 'column notes is cast to an array of no stated type';

    private const string TAGS = 'column tags';

    private const string COUNTS = 'column counts';

    private const string HOW_TO_FIX = 'Cast each to a Data class or DataCollection::class.\':\'.ItemData::class: ';

    private const string FIXTURE = 'tests/Fixtures/ArrayCasts/ShapedArrayCasts.php';

    public function test_no_model_casts_structured_values_to_an_array(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_an_array_of_shapes_is_listed_and_scalar_arrays_are_not(): void
    {
        $output = $this->checkOutput(self::FIXTURE);

        $entries = 'column entries is cast to an array of list<array{name:string,size:int}>';

        $this->assertStringContainsString($entries, $output);
        $this->assertStringContainsString(self::UNTYPED_NOTES, $output);
        $this->assertStringNotContainsString(self::TAGS, $output);
        $this->assertStringNotContainsString(self::COUNTS, $output);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/array-casts.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
