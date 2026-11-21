<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use FilesystemIterator;
use RecursiveCallbackFilterIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * Every PHP source the project owns, relative to its root: the code folders, the tests, and the entry points without a
 * .php suffix that open as PHP. Third-party packages, storage, the bootstrap cache and Blade views are not its own.
 */
final readonly class ReflectionSources
{
    private const array FOLDERS = ['app', 'bootstrap', 'config', 'database', 'domain', 'public', 'routes', 'tests', 'tools'];

    private const array SKIPPED_FOLDERS = ['vendor', 'node_modules', '.git'];

    private const array SKIPPED_PATHS = ['bootstrap/cache', 'storage'];

    /**
     * @param  list<string>  $excluded  files left out by path, relative to the root
     * @return list<string>
     */
    public static function in(string $root, array $excluded): array
    {
        $files = [...self::entryPointsIn($root, $root), ...self::entryPointsIn($root, "{$root}/bin")];

        foreach (self::FOLDERS as $folder) {
            foreach (self::filesUnder($root, "{$root}/{$folder}") as $file) {
                $files[] = $file;
            }
        }

        $files = array_values(array_diff(array_unique($files), $excluded));
        sort($files);

        return $files;
    }

    /**
     * @return list<string>
     */
    private static function filesUnder(string $root, string $folder): array
    {
        if (! is_dir($folder)) {
            return [];
        }

        $entries = new RecursiveIteratorIterator(new RecursiveCallbackFilterIterator(
            new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS),
            fn (SplFileInfo $entry) => ! $entry->isDir() || self::isOwnFolder($root, $entry->getPathname()),
        ));
        $files = [];

        foreach ($entries as $entry) {
            if ($entry instanceof SplFileInfo && self::isPhpSource($entry)) {
                $files[] = substr($entry->getPathname(), strlen($root) + 1);
            }
        }

        return $files;
    }

    /**
     * The files directly in a folder that are PHP without a .php suffix, such as artisan.
     *
     * @return list<string>
     */
    private static function entryPointsIn(string $root, string $folder): array
    {
        $files = [];

        foreach (glob("{$folder}/*") ?: [] as $file) {
            if (is_file($file) && pathinfo($file, PATHINFO_EXTENSION) === '' && self::opensAsPhp($file)) {
                $files[] = substr($file, strlen($root) + 1);
            }
        }

        return $files;
    }

    private static function isOwnFolder(string $root, string $path): bool
    {
        $relative = substr($path, strlen($root) + 1);

        return ! in_array(basename($path), self::SKIPPED_FOLDERS, true)
            && ! in_array($relative, self::SKIPPED_PATHS, true);
    }

    private static function isPhpSource(SplFileInfo $file): bool
    {
        $name = $file->getFilename();

        if (str_ends_with($name, '.blade.php')) {
            return false;
        }

        return str_ends_with($name, '.php') || ($file->getExtension() === '' && self::opensAsPhp($file->getPathname()));
    }

    private static function opensAsPhp(string $file): bool
    {
        $start = (string) file_get_contents($file, length: 64);

        return str_starts_with($start, '<?php') || str_starts_with($start, '#!/usr/bin/env php');
    }
}
