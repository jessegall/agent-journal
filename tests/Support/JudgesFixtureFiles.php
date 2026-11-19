<?php

declare(strict_types=1);

namespace Tests\Support;

use PHPUnit\Framework\Attributes\DataProvider;

/**
 * Judges each fixture file of the test's fixtures() provider and compares the violation lines it finds.
 */
trait JudgesFixtureFiles
{
    /**
     * @return iterable<string, array{string, list<string>}>
     */
    abstract public static function fixtures(): iterable;

    /**
     * The violations found in the fixture file, each as its line and reason.
     *
     * @return list<string>
     */
    abstract private function violationLines(string $fixture): array;

    /**
     * @param  list<string>  $expected
     */
    #[DataProvider('fixtures')]
    public function test_each_fixture_is_judged_as_expected(string $fixture, array $expected): void
    {
        $this->assertSame($expected, $this->violationLines($fixture));
    }
}
