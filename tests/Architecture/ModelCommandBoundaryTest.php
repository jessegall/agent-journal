<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\TestCase;

/**
 * A model knows nothing of commands: no class in a Models folder imports from the bus, its contracts or a Commands
 * namespace, so it extends, implements, uses and throws none of them. A row it cannot find is ModelMissing, which the
 * bus answers as a refusal. The command rule records are the one exception: they store the commands themselves.
 */
final class ModelCommandBoundaryTest extends TestCase
{
    private const string COMMAND_IMPORT = '/^use (App\\\\Bus|App\\\\Contracts\\\\Bus|[A-Za-z\\\\]*\\\\Commands)\\\\/m';

    private const string COMMAND_RECORDS = '/app/Models/CommandRules/';

    public function test_no_model_imports_from_the_bus_or_a_commands_namespace(): void
    {
        $models = array_filter(
            DomainFiles::in([app_path('Models'), ...glob(base_path('domain/*/src/Models')) ?: []]),
            fn (string $file) => ! str_contains($file, self::COMMAND_RECORDS),
        );
        $offending = array_values(array_filter(
            $models,
            fn (string $file) => preg_match(self::COMMAND_IMPORT, (string) file_get_contents($file)) === 1,
        ));

        $this->assertSame([], array_map(fn (string $file) => str_replace(base_path().'/', '', $file), $offending));
    }
}
