<?php

declare(strict_types=1);

namespace App\Autoload\Support;

use App\Autoload\Exceptions\FileOutsideAutoload;
use Composer\Autoload\ClassLoader;

/**
 * The class a PHP file declares, read from Composer's PSR-4 roots: each domain's src folder maps to its own
 * namespace, which Laravel's guess from the base path cannot know.
 */
final readonly class Psr4ClassNames
{
    /**
     * @param  array<string, string>  $roots  each real folder and the namespace it holds, the deepest folder first
     */
    private function __construct(private array $roots) {}

    public static function fromComposer(): self
    {
        $roots = [];

        foreach (ClassLoader::getRegisteredLoaders() as $loader) {
            foreach ($loader->getPrefixesPsr4() as $namespace => $folders) {
                foreach ($folders as $folder) {
                    $real = realpath($folder);

                    if ($real !== false) {
                        $roots[$real] = $namespace;
                    }
                }
            }
        }

        uksort($roots, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        return new self($roots);
    }

    /**
     * The class name of a file under one of the roots, such as Domain\Plans\Listeners\MovePlan for
     * domain/Plans/src/Listeners/MovePlan.php.
     *
     * @return class-string
     */
    public function classOf(string $path): string
    {
        foreach ($this->roots as $folder => $namespace) {
            if (! str_starts_with($path, $folder.DIRECTORY_SEPARATOR)) {
                continue;
            }

            $class = $namespace.str_replace(DIRECTORY_SEPARATOR, '\\', substr($path, strlen($folder) + 1, -4));

            return class_exists($class) ? $class : throw FileOutsideAutoload::missingClass($path, $class);
        }

        throw FileOutsideAutoload::for($path);
    }
}
