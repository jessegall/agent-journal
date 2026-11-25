<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Support\ReflectedType;
use Tests\Architecture\Support\FolderType;
use Tests\TestCase;

/**
 * The command bus page (docs/commands/command-bus.md) names only classes that exist, so its examples stay in step with
 * the code.
 */
final class CommandBusDocumentationTest extends TestCase
{
    public function test_every_class_the_page_names_exists(): void
    {
        $page = (string) file_get_contents(base_path('docs/commands/command-bus.md'));
        preg_match_all('/\b(?:App|Domain)\\\\[A-Za-z\\\\]+[A-Za-z]/', $page, $names);

        $missing = array_values(array_unique(array_filter(
            $names[0],
            fn (
                string $name,
            ) => ! ReflectedType::exists($name) && ! self::isNamespace($name),
        )));

        $this->assertSame([], $missing);
    }

    /**
     * A name the page writes as a namespace, such as Domain\Tasks\Commands in a namespace line.
     */
    private static function isNamespace(string $name): bool
    {
        return in_array(class_basename($name), [FolderType::Commands->value, FolderType::CommandMiddleware->value], true)
            || str_contains($name, '\\Commands\\') && ! str_ends_with($name, 'Command') && ! str_ends_with($name, 'Handler');
    }
}
