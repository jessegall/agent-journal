<?php

declare(strict_types=1);

namespace Tests\Support;

/**
 * The phase test gate: every test file a phase names must exist and hold tests, so a phase never passes on nothing.
 */
final class RequirePhaseTests
{
    /**
     * The named files that are missing or hold no test method.
     *
     * @param  list<string>  $files
     * @return list<string>
     */
    public static function missingTests(array $files): array
    {
        return array_values(array_filter($files, fn (string $file) => ! self::holdsTests($file)));
    }

    /**
     * The command that runs the named files and fails on an empty or skipped suite.
     *
     * @param  list<string>  $files
     * @return list<string>
     */
    public static function command(array $files): array
    {
        return ['vendor/bin/phpunit', '--fail-on-empty-test-suite', '--fail-on-skipped', ...$files];
    }

    private static function holdsTests(string $file): bool
    {
        if (! is_file($file)) {
            return false;
        }

        return preg_match('/function\s+test\w*\s*\(|#\[Test\]/', (string) file_get_contents($file)) === 1;
    }
}
