<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Tests\Support\ScanCache\ScanCache;

/**
 * The PHP files of a set of folders, and every name they use.
 */
final class DomainFiles
{
    /**
     * The code folder of every domain, domain/<Name>/src; a domain's tests beside it are not domain code.
     *
     * @return list<string>
     */
    public static function domainCode(): array
    {
        return glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: [];
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function in(array $folders): array
    {
        $files = array_merge(...array_map(self::allIn(...), array_values(array_filter($folders, is_dir(...)))));
        $files = array_filter($files, fn (string $file) => pathinfo($file, PATHINFO_EXTENSION) === 'php');
        sort($files);

        return $files;
    }

    /**
     * Every file of a folder, whatever its extension.
     *
     * @return list<string>
     */
    public static function allIn(string $folder): array
    {
        $files = [];

        foreach (new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::SKIP_DOTS),
        ) as $entry) {
            if ($entry instanceof SplFileInfo && $entry->isFile()) {
                $files[] = $entry->getPathname();
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
        return ScanCache::findings(new NamesUsedAnywhere($roots), $files);
    }
}
