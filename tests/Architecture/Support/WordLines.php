<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * The lines of code, in names or in text, that use a word a project rule forbids, read from every source file under
 * the folders given, generated code left out.
 */
final readonly class WordLines
{
    /**
     * Rule 46: the user is never a human or a person. Personal, as in a personal desk, and impersonate pass.
     */
    public const string USER_WORDS = '/human|(?<!im)person(?!al)/i';

    /**
     * Task 2196: Claude Code, Codex and the like are drivers, never programs.
     */
    public const string DRIVER_WORDS = '/program/i';

    /**
     * Task 2207: the Go host names a driver a program only in these shapes; program alone there is an OS executable.
     */
    public const string GO_DRIVER_WORDS = '/agent programs?\b|ProgramProfile|\.Program\(\)|keyscripts\.Program\b|'
        .'flags\.String\("program"|json:"program/i';

    private const array EXTENSIONS = ['php', 'go', 'ts', 'vue'];

    private const array GENERATED = ['/resources/js/generated/', '/resources/js/actions/', '/resources/js/routes/'];

    /**
     * Every line under the folders that matches the word pattern, as `path:line`.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function in(string $pattern, array $folders): array
    {
        $found = [];

        foreach ($folders as $folder) {
            foreach (self::codeFiles($folder) as $path) {
                array_push($found, ...self::linesOf($pattern, $path));
            }
        }

        sort($found);

        return $found;
    }

    /**
     * @return list<string>
     */
    private static function linesOf(string $pattern, string $path): array
    {
        $lines = file($path, FILE_IGNORE_NEW_LINES) ?: [];
        $forbiddenWordLines = array_filter($lines, fn (string $line): bool => preg_match($pattern, $line) === 1);

        return array_map(
            fn (int $index): string => sprintf('%s:%d', $path, $index + 1),
            array_keys($forbiddenWordLines),
        );
    }

    /**
     * @return list<string>
     */
    private static function codeFiles(string $folder): array
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::SKIP_DOTS),
        );
        $paths = [];

        foreach ($files as $file) {
            if ($file instanceof SplFileInfo && self::isScannedSourceFile($file)) {
                $paths[] = $file->getPathname();
            }
        }

        return $paths;
    }

    private static function isScannedSourceFile(SplFileInfo $file): bool
    {
        $path = $file->getPathname();
        $isGenerated = array_any(self::GENERATED, fn (string $folder): bool => str_contains($path, $folder));

        return in_array($file->getExtension(), self::EXTENSIONS, true) && ! $isGenerated;
    }
}
