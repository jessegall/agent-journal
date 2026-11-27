<?php

declare(strict_types=1);

namespace App\Support;

use App\Bootstrap\KnownFolderClasses;
use App\Bootstrap\Psr4ClassNames;
use Illuminate\Console\Command;

/**
 * The classes of one type a folder declares, read through Composer's PSR-4 roots, so a list that mirrors a folder is
 * found from the folder instead of written out by hand. Each folder is listed once per process (CodeFiles), and the
 * classes found in it are kept for the process (KnownFolderClasses).
 */
final readonly class FolderClasses
{
    /**
     * Every class of the type declared directly in one of the folders, a folder pattern such as domain/*\/src/Commands
     * included, by class name. The folders are absolute, as a class names them from __DIR__.
     *
     * @template T of object
     *
     * @param  class-string<T>  $type
     * @return list<class-string<T>>
     */
    public static function in(string $folders, string $type): array
    {
        $found = KnownFolderClasses::in($folders, $type, fn () => self::read($folders, $type));

        return array_values(array_filter(
            $found,
            fn (string $class) => Reflector::factory()->is($class, $type),
        ));
    }

    /**
     * The folder of the Artisan commands under a source root, such as app or a domain's src.
     */
    public static function consoleCommandFolder(string $sourceRoot): string
    {
        return $sourceRoot.'/Console/Commands';
    }

    /**
     * The Artisan commands declared directly in the console command folder of a source root.
     *
     * @return list<class-string<Command>>
     */
    public static function consoleCommandsIn(string $sourceRoot): array
    {
        return self::in(self::consoleCommandFolder($sourceRoot), Command::class);
    }

    /**
     * The classes of the type in the process's one listing of the folders.
     *
     * @template T of object
     *
     * @param  class-string<T>  $type
     * @return list<class-string<T>>
     */
    private static function read(string $folders, string $type): array
    {
        $names = Psr4ClassNames::fromComposer();
        $code = CodeFiles::ofProcess();
        $classes = [];

        foreach ($code->folder($code->projectPathOf("{$folders}/*.php")) as $entry) {
            $class = $names->classOf($entry->fingerprint->realPath);

            if (Reflector::factory()->is($class, $type) && Reflector::of($class)->isInstantiable()) {
                $classes[] = $class;
            }
        }

        sort($classes);

        return $classes;
    }
}
