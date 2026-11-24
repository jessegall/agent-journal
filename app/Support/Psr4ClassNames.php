<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\FileOutsideAutoload;
use Composer\Autoload\ClassLoader;

/**
 * The class a PHP file declares, read from Composer's PSR-4 roots: each domain's src folder maps to its own
 * namespace, which Laravel's guess from the base path cannot know. The roots are read once per process: no code
 * registers new ones while it runs.
 */
final class Psr4ClassNames
{
    private static self|null $composerNames = null;

    /**
     * @param  array<string, string>  $roots  each real folder and the namespace it holds, the deepest folder first
     */
    private function __construct(private readonly array $roots) {}

    public static function fromComposer(): self
    {
        return self::$composerNames ??= self::readComposer();
    }

    /**
     * The roots as Composer's registered loaders hold them now.
     */
    private static function readComposer(): self
    {
        $roots = [];

        foreach (ClassLoader::getRegisteredLoaders() as $loader) {
            foreach ($loader->getPrefixesPsr4() as $namespace => $folders) {
                foreach ($folders as $folder) {
                    $roots[self::withoutSteps($folder)] = $namespace;
                }
            }
        }

        uksort($roots, fn (string $one, string $other) => strlen($other) <=> strlen($one));

        return new self($roots);
    }

    /**
     * A folder as Composer names it, such as /app/vendor/composer/../../app, with its '.' and '..' steps taken: the
     * paths Composer builds from its own real folder, so no disk is read to resolve them.
     */
    private static function withoutSteps(string $folder): string
    {
        $names = [];

        foreach (explode('/', $folder) as $name) {
            if ($name === '..') {
                array_pop($names);

                continue;
            }

            if ($name !== '' && $name !== '.') {
                $names[] = $name;
            }
        }

        return '/'.implode('/', $names);
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

            if (Reflector::exists($class)) {
                return $class;
            }

            throw FileOutsideAutoload::missingClass($path, $class);
        }

        throw FileOutsideAutoload::for($path);
    }
}
