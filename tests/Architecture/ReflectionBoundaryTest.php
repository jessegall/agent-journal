<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\ReflectionScan;
use Tests\Architecture\Support\ReflectionSources;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every first-party use of native PHP reflection goes through the wrapper in app/Reflection (doc 84): RawReflectionRule
 * runs over all of the project's own PHP, and only the uses its baseline still lists, by file, declaration and
 * operation, may stand outside the wrapper's own files.
 */
#[TimeLimit(seconds: 600, reason: 'It runs PHPStan over every PHP source the project owns.')]
final class ReflectionBoundaryTest extends TestCase
{
    /**
     * The rule's own fixtures, which use native reflection on purpose.
     */
    private const array RULE_FIXTURES = [
        'tests/Fixtures/PhpStan/RawReflectionControls.php',
        'tests/Fixtures/PhpStan/RawReflectionFactory.php',
        'tests/Fixtures/PhpStan/RawReflectionUses.php',
        'tests/Fixtures/PhpStan/RawReflectionWrapper.php',
    ];

    public function test_native_reflection_outside_the_wrapper_is_only_what_the_baseline_lists(): void
    {
        $root = dirname(__DIR__, 2);
        $sources = ReflectionSources::in($root, self::RULE_FIXTURES);
        $scan = ReflectionScan::of($root, $sources);

        /**
         * @var list<string> $baseline
         */
        $baseline = require __DIR__.'/Support/ReflectionBaseline.php';

        $this->assertSame([], $scan->failures, 'The reflection analysis did not complete.');
        $this->assertGreaterThanOrEqual(count($sources), $scan->analysedFiles, 'The reflection analysis skipped sources.');
        $this->assertSame(
            [],
            $scan->unlistedFindings($baseline),
            'Native reflection outside app/Reflection; read it through the wrapper as each line says.',
        );
        $this->assertSame(
            [],
            $scan->staleEntries($baseline),
            'These baseline lines name reflection that is gone; delete them from tests/Architecture/Support/ReflectionBaseline.php.',
        );
    }
}
