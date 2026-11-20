<?php

declare(strict_types=1);

namespace App\Autoload\Support;

use ReflectionClass;

/**
 * The classes of one type a folder declares, read through Composer's PSR-4 roots, so a list that mirrors a folder is
 * found from the folder instead of written out by hand. Each folder is read once per process (KnownFolderClasses).
 */
final readonly class FolderClasses
{
    /**
     * Every class of the type declared directly in one of the folders, a folder pattern such as app/*\/Commands
     * included, by class name.
     *
     * @template T of object
     *
     * @param  class-string<T>  $type
     * @return list<class-string<T>>
     */
    public static function in(string $folders, string $type): array
    {
        $classes = [];

        foreach (KnownFolderClasses::in($folders, $type, fn () => self::read($folders, $type)) as $class) {
            if (is_a($class, $type, true)) {
                $classes[] = $class;
            }
        }

        return $classes;
    }

    /**
     * The classes of the type the folders declare on disk now.
     *
     * @template T of object
     *
     * @param  class-string<T>  $type
     * @return list<class-string<T>>
     */
    private static function read(string $folders, string $type): array
    {
        $names = Psr4ClassNames::fromComposer();
        $classes = [];

        foreach (glob("{$folders}/*.php") ?: [] as $file) {
            $class = $names->classOf((string) realpath($file));

            if (is_a($class, $type, true) && new ReflectionClass($class)->isInstantiable()) {
                $classes[] = $class;
            }
        }

        sort($classes);

        return $classes;
    }
}
