<?php

declare(strict_types=1);

namespace Tests\Support;

use Tests\Architecture\Support\DomainFiles;
use Tests\Support\ScanCache\ScanCache;

/**
 * Picks the tests a change can break from the code's syntax trees: the classes the changed files declare, then the
 * files that name them, step by step outwards, and the test files among those. A class also reaches the users of what
 * it serves (its interfaces, the command or event it handles) and of the classes a call names with it (the interface
 * a container binds it to, the event it listens to). The reached tests are ranked by how directly they connect to the
 * change, nearest step first and, within a step, the file naming more of that step's classes first, and the most test
 * methods an affected run takes are taken in that order.
 *
 * @phpstan-type TestFile array{class: string, methods: list<string>, names: list<string>}
 * @phpstan-type CodeIndex array{
 *     users: array<string, list<string>>,
 *     links: array<string, list<string>>,
 *     tests: array<string, TestFile>,
 * }
 *
 * @phpstan-import-type RankedTest from AffectedTestSelection
 */
final readonly class AffectedTests
{
    public const int MOST_TEST_METHODS = 100;

    /** The folder whose tests every affected run takes whole, beside the nearest tests and outside their count. */
    private const string ARCHITECTURE_FOLDER = 'tests/Architecture';

    /**
     * The most steps out from the changed classes the reach goes: their users, the users of those, and one more.
     */
    private const int FARTHEST_REACH = 3;

    /**
     * The folders whose PHP files are read for the classes they declare and name.
     */
    private const array CODE_FOLDERS = ['app', 'database', 'domain', 'tests'];

    private const string TEST_FILE_ENDING = 'Test.php';

    /**
     * The folder of code trees tests read as data, whose files named like tests are not run.
     */
    private const string FIXTURES = 'tests/Fixtures/';

    public function __construct(private string $root) {}

    /**
     * The most directly connected test methods the changed files reach, up to the most an affected run takes; a step
     * further out is read only while the nearer steps hold fewer.
     *
     * @param  list<string>  $changedFiles  paths relative to the project root
     */
    public function for(array $changedFiles): AffectedTestSelection
    {
        $findings = $this->findingsByFile();
        $index = $this->indexOf($findings);
        $architecture = $this->architectureTestsOf($index['tests']);
        $index['tests'] = array_diff_key($index['tests'], $architecture);
        $reached = array_values(array_filter(
            array_map(fn (string $file) => "{$this->root}/{$file}", $changedFiles),
            fn (string $path) => isset($findings[$path]),
        ));
        $ranked = $this->rankedAmong($reached, 0, [], $index['tests']);
        $classes = $this->classesOf($changedFiles, $reached, $findings, $index);
        $step = 0;

        while ($step < self::FARTHEST_REACH && $this->methodCountOf($ranked) < self::MOST_TEST_METHODS) {
            $step++;
            $users = array_values(array_diff(array_unique(array_merge([], ...array_map(
                fn (string $class) => $index['users'][$class] ?? [],
                $classes,
            ))), $reached));
            $reached = [...$reached, ...$users];
            $ranked = [...$ranked, ...$this->rankedAmong($users, $step, $classes, $index['tests'])];
            $classes = $this->classesDeclaredIn($users, $findings, $index['links']);
        }

        $selection = AffectedTestSelection::nearestOf($ranked, self::MOST_TEST_METHODS, $step);

        return $selection->withEveryTestOf($this->classesByFile($architecture));
    }

    /**
     * The architecture tests among the test files: an affected run takes each of them whole, outside its count.
     *
     * @param  array<string, array{class: string, methods: list<string>}>  $tests
     * @return array<string, array{class: string, methods: list<string>}>
     */
    private function architectureTestsOf(array $tests): array
    {
        $folder = "{$this->root}/".self::ARCHITECTURE_FOLDER.'/';

        return array_filter($tests, fn (string $path) => str_starts_with($path, $folder), ARRAY_FILTER_USE_KEY);
    }

    /**
     * The class of each test file, by the file's path from the project root.
     *
     * @param  array<string, array{class: string, methods: list<string>}>  $tests
     * @return array<string, string>
     */
    private function classesByFile(array $tests): array
    {
        $classes = [];

        foreach ($tests as $path => $test) {
            $classes[substr($path, strlen($this->root) + 1)] = $test['class'];
        }

        return $classes;
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
     * The files that name each class, the classes a call names with each class, and each test file with its class, its
     * test methods and the classes it names.
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

            if (str_ends_with($path, self::TEST_FILE_ENDING) && ! str_starts_with($path, "{$this->root}/".self::FIXTURES)) {
                $test = $this->testFileOf($found);

                if ($test['methods'] !== []) {
                    $tests[$path] = $test;
                }
            }
        }

        return [
            'users' => $users,
            'links' => array_map(fn (array $linked) => array_values(array_unique($linked)), $links),
            'tests' => $tests,
        ];
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
     * What a test file's syntax tree says it is: its class, its test methods in order and the classes it names.
     *
     * @param  list<string>  $found
     * @return TestFile
     */
    private function testFileOf(array $found): array
    {
        $test = ['class' => '', 'methods' => [], 'names' => []];

        foreach ($found as $finding) {
            if ($test['class'] === '' && str_starts_with($finding, CodeReferenceScan::DECLARES)) {
                $test['class'] = substr($finding, strlen(CodeReferenceScan::DECLARES));
            }

            if (str_starts_with($finding, CodeReferenceScan::TEST)) {
                $test['methods'][] = substr($finding, strlen(CodeReferenceScan::TEST));
            }

            if (str_starts_with($finding, CodeReferenceScan::NAMES)) {
                $test['names'][] = substr($finding, strlen(CodeReferenceScan::NAMES));
            }
        }

        return $test;
    }

    /**
     * The test files among the files one step reached, the file naming more of the step's classes first, then by path.
     *
     * @param  list<string>  $paths
     * @param  list<string>  $classes  the classes whose users this step reached
     * @param  array<string, TestFile>  $tests
     * @return list<RankedTest>
     */
    private function rankedAmong(array $paths, int $step, array $classes, array $tests): array
    {
        $ranked = [];

        foreach ($paths as $path) {
            if (isset($tests[$path])) {
                $ranked[] = [
                    'file' => substr($path, strlen($this->root) + 1),
                    'class' => $tests[$path]['class'],
                    'methods' => $tests[$path]['methods'],
                    'step' => $step,
                    'connections' => count(array_intersect($tests[$path]['names'], $classes)),
                ];
            }
        }

        usort($ranked, fn (array $first, array $second) => [$second['connections'], $first['file']]
            <=> [$first['connections'], $second['file']]);

        return $ranked;
    }

    /**
     * @param  list<RankedTest>  $ranked
     */
    private function methodCountOf(array $ranked): int
    {
        return array_sum(array_map(fn (array $test) => count($test['methods']), $ranked));
    }
}
