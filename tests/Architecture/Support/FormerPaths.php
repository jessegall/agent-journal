<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

/**
 * The path each Core file had before the move to Laravel's layout, so a rule written for an old area, such as
 * only app/Sharing names the sharing secrets, keeps judging the same files. A file that did not move keeps its path.
 */
final class FormerPaths
{
    public const string MAP = 'tests/Architecture/FormerPaths/former-paths.json';

    /**
     * @var array<string, string>|null
     */
    private static array|null $paths = null;

    /**
     * The former path of a file given relative to the project, or the path itself when it did not move.
     */
    public static function of(string $relativePath): string
    {
        return self::paths()[$relativePath] ?? $relativePath;
    }

    /**
     * Whether the file is, or was before it moved, in one of the folders, each given as a prefix such as app/Sharing/.
     *
     * @param  list<string>  $prefixes
     */
    public static function wasIn(string $relativePath, array $prefixes): bool
    {
        $paths = [$relativePath, self::of($relativePath)];

        return array_any(
            $prefixes,
            fn (string $prefix) => array_any($paths, fn (string $path) => str_starts_with($path, $prefix)),
        );
    }

    /**
     * Whether the App class's file was in one of the old folders, each given as a prefix such as app/Assignments/.
     *
     * @param  list<string>  $prefixes
     */
    public static function classWasIn(string $className, array $prefixes): bool
    {
        return str_starts_with($className, 'App\\')
            && self::wasIn('app/'.str_replace('\\', '/', substr($className, 4)).'.php', $prefixes);
    }

    /**
     * The folders to scan for a list of judged folders, given from the project root: the package and test folders as
     * they are, and app whole when an old Core area such as app/Bus is among them.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function foldersToScan(array $folders): array
    {
        $others = array_values(array_filter($folders, fn (string $folder) => ! str_starts_with($folder, 'app/')));

        return count($others) === count($folders) ? $others : [...$others, 'app'];
    }

    /**
     * Whether a scanned file lies outside the judged folders: an app file that was in none of the old Core areas.
     *
     * @param  list<string>  $folders
     */
    public static function liesOutside(string $relativePath, array $folders): bool
    {
        $coreAreas = array_values(array_map(
            fn (string $folder) => "{$folder}/",
            array_filter($folders, fn (string $folder) => str_starts_with($folder, 'app/')),
        ));

        return str_starts_with($relativePath, 'app/') && ! self::wasIn($relativePath, $coreAreas);
    }

    /**
     * Every current file, relative to the project, that was in one of the old folders.
     *
     * @param  list<string>  $prefixes
     * @return list<string>
     */
    public static function filesFrom(array $prefixes): array
    {
        return array_values(array_filter(
            array_keys(self::paths()),
            fn (string $path) => self::wasIn($path, $prefixes),
        ));
    }

    /**
     * @return array<string, string>
     */
    private static function paths(): array
    {
        return self::$paths ??= self::read();
    }

    /**
     * @return array<string, string>
     */
    private static function read(): array
    {
        /** @var array<string, string> $paths */
        $paths = json_decode((string) file_get_contents(dirname(__DIR__, 3).'/'.self::MAP), true, flags: JSON_THROW_ON_ERROR);

        return $paths;
    }
}
