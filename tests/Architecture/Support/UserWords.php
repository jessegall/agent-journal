<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * The lines of code that call the user a human or a person, in a name or in text (rule 46). Personal, as in a
 * personal desk, and impersonate are other words and pass.
 */
final readonly class UserWords
{
    private const string WORD = '/human|(?<!im)person(?!al)/i';

    private const array EXTENSIONS = ['php', 'go', 'ts', 'vue'];

    private const array GENERATED = ['/resources/js/generated/', '/resources/js/actions/', '/resources/js/routes/'];

    /**
     * Every line under the folders that says human or person, as `path:line`.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public static function in(array $folders): array
    {
        $found = [];

        foreach ($folders as $folder) {
            foreach (self::codeFiles($folder) as $path) {
                array_push($found, ...self::linesOf($path));
            }
        }

        sort($found);

        return $found;
    }

    /**
     * @return list<string>
     */
    private static function linesOf(string $path): array
    {
        $lines = file($path, FILE_IGNORE_NEW_LINES) ?: [];
        $said = array_filter($lines, fn (string $line): bool => preg_match(self::WORD, $line) === 1);

        return array_map(fn (int $index): string => sprintf('%s:%d', $path, $index + 1), array_keys($said));
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
            if ($file instanceof SplFileInfo && self::isJudged($file)) {
                $paths[] = $file->getPathname();
            }
        }

        return $paths;
    }

    private static function isJudged(SplFileInfo $file): bool
    {
        $path = $file->getPathname();
        $isGenerated = array_any(self::GENERATED, fn (string $folder): bool => str_contains($path, $folder));

        return in_array($file->getExtension(), self::EXTENSIONS, true) && ! $isGenerated;
    }
}
