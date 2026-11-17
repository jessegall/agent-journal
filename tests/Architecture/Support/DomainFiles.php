<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * The PHP files of a set of folders, and every name they use.
 */
final class DomainFiles
{
    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function in(array $folders): array
    {
        $files = [];

        foreach (array_filter($folders, is_dir(...)) as $folder) {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder)) as $entry) {
                if ($entry instanceof SplFileInfo && $entry->getExtension() === 'php') {
                    $files[] = $entry->getPathname();
                }
            }
        }

        sort($files);

        return $files;
    }

    /**
     * @param  list<string>  $files
     * @return list<NameUse>
     */
    public static function usesIn(array $files, ProjectRoots $roots): array
    {
        $uses = [];

        foreach ($files as $path) {
            $file = ParsedFile::fromPath($path);
            array_push($uses, ...NameScan::of($file), ...DocblockScan::of($file), ...StringScan::of($file, $roots));
        }

        return $uses;
    }
}
