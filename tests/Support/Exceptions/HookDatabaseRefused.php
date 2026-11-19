<?php

declare(strict_types=1);

namespace Tests\Support\Exceptions;

use LogicException;

/**
 * The hook test database could not be selected safely, so the test stops before it touches any database.
 */
final class HookDatabaseRefused extends LogicException
{
    public static function outsideTesting(): self
    {
        return new self('The hook test database is only selected while testing.');
    }

    public static function otherDatabase(string $selected, string $expected): self
    {
        return new self("The hook tests selected the database {$selected}, not {$expected}.");
    }

    public static function baseDatabaseInWorker(string $selected, string $expected): self
    {
        return new self(
            sprintf(
                'The hook tests selected the database %s, not %s: this parallel worker kept the shared database, so run the tests through "php artisan test --parallel", which gives each worker its own.',
                $selected,
                $expected,
            ),
        );
    }

    public static function baseDatabaseMissing(string $name): self
    {
        return new self(
            "The base test database {$name} does not exist: create it once with scripts/prepare-hook-test-database.sh.",
        );
    }
}
