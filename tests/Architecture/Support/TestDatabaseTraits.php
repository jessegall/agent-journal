<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Support\ScanCache\ScanCache;

/**
 * A test reaches its database only through Tests\Support\RefreshHookDatabase, never through one of Laravel's database
 * traits directly, so every test passes the hook database guard.
 */
final class TestDatabaseTraits
{
    private const array LARAVEL_DATABASE_TRAITS = [
        RefreshDatabase::class,
        DatabaseMigrations::class,
        DatabaseTruncation::class,
        DatabaseTransactions::class,
    ];

    /**
     * The files under these folders that use one of Laravel's database traits, leaving out the skipped files and folders.
     *
     * @param  list<string>  $folders
     * @param  list<string>  $skipped
     * @return list<string>
     */
    public static function offendersIn(array $folders, array $skipped): array
    {
        $traitsByFile = ScanCache::findingsByFile(new TraitsUsed(), DomainFiles::in($folders));
        $offenders = array_filter(
            array_keys($traitsByFile),
            fn (string $path) => ! self::isSkipped($path, $skipped) && array_intersect($traitsByFile[$path], self::LARAVEL_DATABASE_TRAITS) !== [],
        );

        return array_values($offenders);
    }

    /**
     * @param  list<string>  $skipped
     */
    private static function isSkipped(string $path, array $skipped): bool
    {
        foreach ($skipped as $skippedPath) {
            if ($path === $skippedPath || str_starts_with($path, rtrim($skippedPath, '/').'/')) {
                return true;
            }
        }

        return false;
    }
}
