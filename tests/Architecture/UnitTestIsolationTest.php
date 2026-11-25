<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ClassesDeclared;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * No unit test takes the database: a test that needs rows is a command, state or entry test, so the unit tests stay
 * fast and run without one.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every unit test file.')]
final class UnitTestIsolationTest extends TestCase
{
    private const string HOW_TO_FIX = 'Move the test that needs the database out of the unit tests, or drop the rows:';

    public function test_no_unit_test_uses_the_hook_database(): void
    {
        $folders = [base_path('tests/Unit'), ...glob(base_path('domain/*/tests/Unit'), GLOB_ONLYDIR) ?: []];
        $databased = [];

        foreach (ScanCache::findingsInFolders(new ClassesDeclared(), $folders) as $classes) {
            foreach ($classes as $class) {
                if (in_array(RefreshHookDatabase::class, class_uses_recursive($class), true)) {
                    $databased[] = $class;
                }
            }
        }

        $this->assertSame([], $databased, self::HOW_TO_FIX);
    }
}
