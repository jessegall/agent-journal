<?php

declare(strict_types=1);

namespace Tests\Support\ScanCache;

use Tests\Architecture\Support\ParsedFile;

/**
 * Keeps each file's findings for each scan on disk, keyed by the file's content hash, so a run parses only the files
 * that changed since the last one. Parallel workers each write a whole new cache file and rename it into place.
 */
final class ScanCache
{
    /**
     * How many files the scans of this process had to parse, for the test that proves unchanged files are skipped.
     */
    private static int $parsedFiles = 0;

    /**
     * @template TFinding
     *
     * @param  FileScan<TFinding>  $scan
     * @param  list<string>  $paths
     * @return list<TFinding>
     */
    public static function findings(FileScan $scan, array $paths): array
    {
        return array_merge([], ...array_values(self::findingsByFile($scan, $paths)));
    }

    /**
     * @template TFinding
     *
     * @param  FileScan<TFinding>  $scan
     * @param  list<string>  $paths
     * @return array<string, list<TFinding>> each path's findings
     */
    public static function findingsByFile(FileScan $scan, array $paths): array
    {
        $cacheFile = self::cacheFileFor($scan);
        $stored = self::read($cacheFile);
        $byFile = [];

        foreach ($paths as $path) {
            $hash = sha1((string) file_get_contents($path));

            if (! isset($stored[$hash])) {
                self::$parsedFiles++;
                $stored[$hash] = $scan->findingsIn(ParsedFile::fromPath($path));
            }

            $byFile[$path] = $stored[$hash];
        }

        self::write($cacheFile, $stored);

        return $byFile;
    }

    public static function parsedFiles(): int
    {
        return self::$parsedFiles;
    }

    private static function cacheFileFor(FileScan $scan): string
    {
        return dirname(__DIR__, 3).'/storage/framework/testing/scan-cache/'.preg_replace('/[^a-z0-9_.-]+/i', '-', $scan->key()).'.cache';
    }

    /**
     * @return array<string, list<mixed>>
     */
    private static function read(string $cacheFile): array
    {
        if (! is_file($cacheFile)) {
            return [];
        }

        $stored = @unserialize((string) file_get_contents($cacheFile));

        return is_array($stored) ? $stored : [];
    }

    /**
     * @param  array<string, list<mixed>>  $findings
     */
    private static function write(string $cacheFile, array $findings): void
    {
        if (! is_dir(dirname($cacheFile))) {
            @mkdir(dirname($cacheFile), 0777, true);
        }

        $temporary = $cacheFile.'.'.getmypid().'.'.bin2hex(random_bytes(4));
        file_put_contents($temporary, serialize($findings));
        rename($temporary, $cacheFile);
    }
}
