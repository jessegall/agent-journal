<?php

declare(strict_types=1);

namespace Tests\Support\ScanCache;

use App\Support\Reflector;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ParsedFile;

/**
 * Keeps each file's findings per scan on disk, keyed by path and content hash, so a run parses only changed files; a
 * file with unchanged time and size is not even hashed. Parallel workers each write a whole new cache file and rename
 * it into place.
 */
final class ScanCache
{
    /**
     * How many files the scans of this process had to parse, for the test that proves unchanged files are skipped.
     */
    /**
     * How many seconds after its last change a file's stamp is trusted, past the one-second precision of a
     * modification time and a small difference between the clock of a container and of the disk it reads.
     */
    private const int RACY_SECONDS = 2;

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
     * The scan's findings for every PHP file under the folders, keyed by file path.
     *
     * @template TFinding
     *
     * @param  FileScan<TFinding>  $scan
     * @param  list<string>  $folders
     * @return array<string, list<TFinding>>
     */
    public static function findingsInFolders(FileScan $scan, array $folders): array
    {
        return self::findingsByFile($scan, DomainFiles::in($folders));
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
        // A file changed earlier in this process must be stated afresh, not from PHP's stat cache.
        clearstatcache();
        $cacheFile = self::cacheFileFor($scan);
        $stored = self::read($cacheFile);
        $byFile = [];
        $changed = false;

        foreach ($paths as $path) {
            $modified = (int) filemtime($path);
            $stamp = $modified.':'.filesize($path);

            if (($stored[$path]['stamp'] ?? null) !== $stamp) {
                $hash = sha1((string) file_get_contents($path));

                if (($stored[$path]['hash'] ?? null) !== $hash) {
                    self::$parsedFiles++;
                    $stored[$path] = ['hash' => $hash, 'findings' => $scan->findingsIn(ParsedFile::fromPath($path))];
                }

                // A file written within a second of its reading may change again without its stamp changing, so its
                // stamp is kept only once that time has passed; until then its content hash is compared on each read.
                $stored[$path]['stamp'] = $modified < time() - self::RACY_SECONDS ? $stamp : '';
                $changed = true;
            }

            $byFile[$path] = $stored[$path]['findings'];
        }

        if ($changed) {
            // A file that is gone, such as one a move renamed, keeps no entry, so the cache holds only what exists.
            self::write($cacheFile, array_filter($stored, is_file(...), ARRAY_FILTER_USE_KEY));
        }

        return $byFile;
    }

    public static function parsedFiles(): int
    {
        return self::$parsedFiles;
    }

    /**
     * @param  FileScan<mixed>  $scan
     */
    private static function cacheFileFor(FileScan $scan): string
    {
        // The scan's own code is part of the key, so a changed scan never reads the findings of its old self.
        $code = Reflector::of($scan)->fileName()->map(fn (string $file) => (string) sha1_file($file))->getOrElse('');

        return dirname(__DIR__, 3).'/storage/framework/testing/scan-cache/'.preg_replace(
            '/[^a-z0-9_.-]+/i',
            '-',
            $scan->key(),
        ).'-'.substr($code, 0, 12).'.cache';
    }

    /**
     * @return array<string, array{hash: string, stamp?: string, findings: list<mixed>}>
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
     * @param  array<string, array{hash: string, stamp?: string, findings: list<mixed>}>  $findings
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
