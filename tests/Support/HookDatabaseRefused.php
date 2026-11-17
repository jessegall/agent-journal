<?php

declare(strict_types=1);

namespace Tests\Support;

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

    public static function otherDatabase(string $selected): self
    {
        return new self("The hook tests selected the database {$selected}, not ".HookDatabase::NAME.'.');
    }
}
