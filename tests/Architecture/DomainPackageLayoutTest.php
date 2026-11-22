<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every domain is a package in Laravel's own layout: its code in domain/<Name>/src, its migrations, factories and
 * seeders in domain/<Name>/database and its tests in domain/<Name>/tests, never a Database folder inside src.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class DomainPackageLayoutTest extends TestCase
{
    private const string HOW_TO_FIX = 'Move it to domain/<Name>/database, '
        .'as a Laravel project keeps database/ beside app/.';

    public function test_no_domain_keeps_its_database_folder_inside_src(): void
    {
        $this->assertSame([], array_map(
            fn (string $folder) => substr($folder, strlen(base_path()) + 1),
            glob(base_path('domain/*/src/Database'), GLOB_ONLYDIR) ?: [],
        ), self::HOW_TO_FIX);
    }

    public function test_every_domain_has_its_code_in_src(): void
    {
        $withoutSource = array_filter(
            glob(base_path('domain/*'), GLOB_ONLYDIR) ?: [],
            fn (string $package) => ! is_dir("{$package}/src"),
        );

        $this->assertSame([], array_values(array_map(basename(...), $withoutSource)));
    }
}
