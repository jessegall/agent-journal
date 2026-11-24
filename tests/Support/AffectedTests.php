<?php

declare(strict_types=1);

namespace Tests\Support;

use Tests\Architecture\Support\DomainFiles;
use Tests\Support\ScanCache\ScanCache;

/**
 * Picks the tests a change can break from the code's syntax trees: the classes the changed files declare, then the
 * files that name them, step by step outwards, and the test files among those. A class also reaches the users of what
 * it serves (its interfaces, the command or event it handles) and of the classes a call names with it (the interface
 * a container binds it to, the event it listens to). It goes as many steps out as stays within the most test methods
 * an affected run takes.
 *
 * @phpstan-type CodeIndex array{
 *     users: array<string, list<string>>,
 *     links: array<string, list<string>>,
 *     tests: array<string, int>,
 * }
 */
final readonly class AffectedTests
{
    public const int MOST_TEST_METHODS = 100;

    /**
     * The most steps out from the changed classes the reach goes: their users, the users of those, and one more.
     */
    private const int FARTHEST_REACH = 3;

    /**
     * The folders whose PHP files are read for the classes they declare and name.
     */
    private const array CODE_FOLDERS = ['app', 'database', 'domain', 'tests'];

    private const string TEST_FILE_ENDING = 'Test.php';

    public function __construct(private string $root) {}

    /**
     * The tests the changed files reach, from the nearest step out as far as the selection stays within the most test
     * methods; the nearest step alone when even that holds more, which the run then refuses.
     *
     * @param  list<string>  $changedFiles  paths relative to the project root
     */
    public function for(array $changedFiles): AffectedTestSelection
    {
        $findings = $this->findingsByFile();
        $index = $this->indexOf($findings);
        $reached = array_values(array_filter(
            array_map(fn (string $file) => "{$this->root}/{$file}", $changedFiles),
            fn (string $path) => isset($findings[$path]),
        ));
        $classes = $this->classesOf($changedFiles, $reached, $findings, $index);
        $selection = new AffectedTestSelection($this->testsAmong($reached, $index['tests']), 0);

        for ($step = 1; $step <= self::FARTHEST_REACH; $step++) {
            $users = array_values(array_unique(array_merge([], ...array_map(
                fn (string $class) => $index['users'][$class] ?? [],
                $classes,
            ))));
            $reached = array_values(array_unique([...$reached, ...$users]));
            $next = new AffectedTestSelection($this->testsAmong($reached, $index['tests']), $step);

            if ($next->isRefused()) {
                return $step === 1 ? $next : $selection;
            }

            $selection = $next;
            $classes = $this->classesDeclaredIn($users, $findings, $index['links']);
        }

        return $selection;
    }

    /**
     * Each PHP file of the code folders with what its syntax tree says, read again only when the file changed.
     *
     * @return array<string, list<string>>
     */
    private function findingsByFile(): array
    {
        return ScanCache::findingsByFile(
            new CodeReferenceScan(),
            DomainFiles::in(array_map(fn (string $folder) => "{$this->root}/{$folder}", self::CODE_FOLDERS)),
        );
    }

    /**
     * The files that name each class, the classes a call names with each class, and the test methods each test file
     * holds.
     *
     * @param  array<string, list<string>>  $findings
     * @return CodeIndex
     */
    private function indexOf(array $findings): array
    {
        $users = [];
        $links = [];
        $tests = [];

        foreach ($findings as $path => $found) {
            foreach ($found as $finding) {
                if (str_starts_with($finding, CodeReferenceScan::NAMES)) {
                    $users[substr($finding, strlen(CodeReferenceScan::NAMES))][] = $path;
                }

                if (str_starts_with($finding, CodeReferenceScan::LINKS)) {
                    $linked = explode(' ', substr($finding, strlen(CodeReferenceScan::LINKS)));

                    foreach ($linked as $class) {
                        $links[$class] = [...$links[$class] ?? [], ...array_diff($linked, [$class])];
                    }
                }
            }

            if (str_ends_with($path, self::TEST_FILE_ENDING)) {
                $tests[$path] = count(array_filter(
                    $found,
                    fn (string $finding) => str_starts_with($finding, CodeReferenceScan::TEST),
                ));
            }
        }

        return ['users' => $users, 'links' => array_map(fn (array $linked) => array_values(array_unique($linked)), $links), 'tests' => $tests];
    }

    /**
     * The classes the changed files declare and implement; a removed file stands for every named class of its name.
     *
     * @param  list<string>  $changedFiles
     * @param  list<string>  $existing  the changed files that are still there, as full paths
     * @param  array<string, list<string>>  $findings
     * @param  CodeIndex  $index
     * @return list<string>
     */
    private function classesOf(array $changedFiles, array $existing, array $findings, array $index): array
    {
        $removedNames = array_map(
            fn (string $file) => '\\'.basename($file, '.php'),
            array_filter(
                $changedFiles,
                fn (string $file) => str_ends_with($file, '.php') && ! is_file("{$this->root}/{$file}"),
            ),
        );
        $removed = array_filter(
            array_keys($index['users']),
            fn (string $class) => array_any($removedNames, fn (string $name) => str_ends_with('\\'.$class, $name)),
        );

        return array_values(array_unique([
            ...$this->classesDeclaredIn($existing, $findings, $index['links']),
            ...$removed,
        ]));
    }

    /**
     * The classes the files declare, with what they serve and the classes a call names with them, whose users a change
     * of the files reaches.
     *
     * @param  list<string>  $paths
     * @param  array<string, list<string>>  $findings
     * @param  array<string, list<string>>  $links
     * @return list<string>
     */
    private function classesDeclaredIn(array $paths, array $findings, array $links): array
    {
        $classes = [];

        foreach ($paths as $path) {
            foreach ($findings[$path] ?? [] as $finding) {
                if (str_starts_with($finding, CodeReferenceScan::DECLARES)) {
                    $declared = substr($finding, strlen(CodeReferenceScan::DECLARES));
                    array_push($classes, $declared, ...($links[$declared] ?? []));
                }

                if (str_starts_with($finding, CodeReferenceScan::SERVES)) {
                    $classes[] = substr($finding, strlen(CodeReferenceScan::SERVES));
                }
            }
        }

        return array_values(array_unique($classes));
    }

    /**
     * The test files among the reached files with their test methods, relative to the project root.
     *
     * @param  list<string>  $reached
     * @param  array<string, int>  $tests
     * @return array<string, int>
     */
    private function testsAmong(array $reached, array $tests): array
    {
        $selected = [];

        foreach ($reached as $path) {
            if (($tests[$path] ?? 0) > 0) {
                $selected[substr($path, strlen($this->root) + 1)] = $tests[$path];
            }
        }

        ksort($selected);

        return $selected;
    }
}
