<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\ReflectionScan;
use Tests\Architecture\Support\ReflectionSources;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every first-party use of native PHP reflection, and every question about a type by its name, goes through the
 * wrapper in app/Reflection: RawReflectionRule runs over all of the project's own PHP and finds none outside
 * the wrapper's own files.
 */
#[TimeLimit(seconds: 600, reason: 'It runs PHPStan over every PHP source the project owns.')]
final class ReflectionBoundaryTest extends TestCase
{
    private const string INCOMPLETE = 'The reflection analysis did not complete.';

    private const string SKIPPED = 'The reflection analysis skipped sources.';

    private const string HOW_TO_FIX = 'Native reflection or a raw type question outside app/Reflection; '
        .'ask the Reflector as each line says.';

    /**
     * The rule's own fixtures, which use native reflection on purpose.
     */
    private const array RULE_FIXTURES = [
        'tests/Fixtures/PhpStan/RawReflectionControls.php',
        'tests/Fixtures/PhpStan/RawReflectionFactory.php',
        'tests/Fixtures/PhpStan/RawReflectionUses.php',
        'tests/Fixtures/PhpStan/RawReflectionWrapper.php',
    ];

    public function test_no_native_reflection_or_type_question_stands_outside_the_wrapper(): void
    {
        $root = dirname(__DIR__, 2);
        $sources = ReflectionSources::in($root, self::RULE_FIXTURES);
        $scan = ReflectionScan::of($root, $sources);

        $this->assertSame([], $scan->failures, self::INCOMPLETE);
        $this->assertGreaterThanOrEqual(count($sources), $scan->analysedFiles, self::SKIPPED);
        $this->assertSame(
            [],
            $scan->reports(),
            self::HOW_TO_FIX,
        );
    }
}
