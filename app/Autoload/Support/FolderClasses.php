<?php

declare(strict_types=1);

namespace App\Autoload\Support;

use App\Files\Support\CodeFiles;
use ReflectionClass;

/**
 * The classes of one type a folder declares, read through Composer's PSR-4 roots, so a list that mirrors a folder is
 * found from the folder instead of written out by hand. Each folder is listed once per process (CodeFiles).
 */
final readonly class FolderClasses
{
    /**
     * Every class of the type declared directly in one of the folders, a folder pattern such as app/*\/Commands
     * included, by class name. The folders are absolute, as a class names them from __DIR__.
     *
     * @template T of object
     *
     * @param  class-string<T>  $type
     * @return list<class-string<T>>
     */
    public static function in(string $folders, string $type): array
    {
        $names = Psr4ClassNames::fromComposer();
        $code = CodeFiles::ofProcess();
        $classes = [];

        foreach ($code->folder($code->projectPathOf("{$folders}/*.php")) as $entry) {
            $class = $names->classOf($entry->fingerprint->realPath);

            if (is_a($class, $type, true) && new ReflectionClass($class)->isInstantiable()) {
                $classes[] = $class;
            }
        }

        sort($classes);

        return $classes;
    }
}
