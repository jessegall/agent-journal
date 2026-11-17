<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Foundation\Testing\DatabaseTruncation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\TraitUse;
use PhpParser\NodeFinder;

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
        $offenders = array_filter(
            DomainFiles::in($folders),
            fn (string $path) => ! self::isSkipped($path, $skipped) && self::usesLaravelDatabaseTrait($path),
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

    private static function usesLaravelDatabaseTrait(string $path): bool
    {
        $traitUses = (new NodeFinder)->findInstanceOf(ParsedFile::fromPath($path)->statements, TraitUse::class);

        foreach ($traitUses as $traitUse) {
            $names = array_map(fn (Name $trait) => $trait->toString(), $traitUse->traits);

            if (array_intersect($names, self::LARAVEL_DATABASE_TRAITS) !== []) {
                return true;
            }
        }

        return false;
    }
}
