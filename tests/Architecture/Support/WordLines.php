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
     * The user is never a human, a person or people, in a name or in a text. Personal, as in a personal desk,
     * impersonate and the grammar term third-person pass.
     */
    public const string USER_WORDS = '/(?<![A-Za-z])(?<!third-)(person|people|human)(?!al)|(Person|People|Human)(?!al)'
        .'|PERSON(?!AL)|PEOPLE|HUMAN/';

    /**
     * Claude Code, Codex and the like are drivers, never programs.
     */
    public const string DRIVER_WORDS = '/program/i';

    /**
     * The Go host names a driver a program only in these shapes; program alone there is an OS executable.
     */
    public const string GO_DRIVER_WORDS = '/agent programs?\b|ProgramProfile|\.Program\(\)|keyscripts\.Program\b|'
        .'flags\.String\("program"|json:"program/i';

    private const array EXTENSIONS = ['php', 'go', 'ts', 'vue'];

    private const array GENERATED = ['/resources/js/generated/', '/resources/js/actions/', '/resources/js/routes/'];

    /**
     * Where the project's own files are: its code, tests, tools, documents, designs, scripts and Docker files.
     */
    private const array PROJECT_FOLDERS = [
        'app', 'domain', 'tests', 'resources', 'tools', 'database', 'docs', 'config', 'routes', 'scripts', 'bootstrap',
        '.docker', '.commandments/custom',
    ];

    private const array PROJECT_FILES = ['CLAUDE.md', 'README.md', 'compose.yaml', '.env.example'];

    private const array PROJECT_EXTENSIONS = [
        'php', 'go', 'ts', 'vue', 'js', 'md', 'html', 'sh', 'json', 'yaml', 'yml', 'css', 'toml', 'example', '',
    ];

    /**
     * What is not the project's own writing: installed or built files, recordings of a driver, the reviewed name
     * list, texts kept from version 5, and the files that state or show the forbidden words themselves.
     */
    private const array NOT_PROJECT = [
        '/vendor/', '/node_modules/', '/bootstrap/cache/', '/docs/naming/', '/docs/agents/version-5/',
        '/tools/journal-agent/testdata/', '/tests/Fixtures/UserWords/', '/tests/Architecture/UserWordTest.php',
        '/tests/Architecture/Support/WordLines.php', '/tests/Architecture/FrozenModelWrites/',
    ];

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
     * Every line of the project's own files that matches the word pattern, as `path:line`: every kind of text file
     * the project writes, not only its code.
     *
     * @return list<string>
     */
    public static function inProject(string $pattern): array
    {
        $paths = array_map(base_path(...), self::PROJECT_FILES);

        foreach (self::PROJECT_FOLDERS as $folder) {
            array_push($paths, ...self::filesOf(base_path($folder), self::PROJECT_EXTENSIONS, self::NOT_PROJECT));
        }

        $found = array_merge(...array_map(fn (string $path): array => self::linesOf($pattern, $path), $paths));
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
        return self::filesOf($folder, self::EXTENSIONS, self::GENERATED);
    }

    /**
     * The files under the folder with one of the extensions, outside every skipped part of a path.
     *
     * @param  list<string>  $extensions
     * @param  list<string>  $skipped
     * @return list<string>
     */
    private static function filesOf(string $folder, array $extensions, array $skipped): array
    {
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folder, RecursiveDirectoryIterator::SKIP_DOTS),
        );
        $paths = [];

        foreach ($files as $file) {
            $isWanted = $file instanceof SplFileInfo
                && in_array($file->getExtension(), $extensions, true)
                && ! array_any($skipped, fn (string $part): bool => str_contains($file->getPathname(), $part));

            if ($isWanted) {
                $paths[] = $file->getPathname();
            }
        }

        return $paths;
    }
}
