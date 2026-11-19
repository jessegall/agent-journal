<?php

declare(strict_types=1);

/*
 * The PHP files under the given files and folders, shared by the line-width scripts in this folder.
 */

/**
 * The PHP files under the given paths.
 *
 * @param  list<string>  $paths
 * @return list<string>
 */
function phpFiles(array $paths): array
{
    $files = [];

    foreach ($paths as $path) {
        if (is_file($path)) {
            $files[] = $path;

            continue;
        }

        $entries = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS));

        foreach ($entries as $entry) {
            if ($entry->isFile() && str_ends_with($entry->getFilename(), '.php')) {
                $files[] = $entry->getPathname();
            }
        }
    }

    return $files;
}
