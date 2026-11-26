<?php

declare(strict_types=1);

/**
 * Lists tests that overlap, so removing one is a calculated choice. For each test
 * method it reads the commands it runs, the classes it touches and the assertions it makes; then it prints the pairs
 * whose sets are near-identical (Jaccard at or above the threshold) and the tests whose whole set lies inside a
 * command test's, each with its score.
 *
 *   php tools/refactoring/test-overlap.php [--threshold=0.8] [<path> ...]
 *       prints "overlap<TAB>score<TAB>test<TAB>test" and "covered<TAB>score<TAB>test<TAB>command test" lines.
 */

use PhpParser\Node;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\New_;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/** A test with fewer facts than this says too little to compare. */
const SMALLEST_SET = 4;

main(array_slice($argv, 1));

/**
 * @param  list<string>  $arguments
 */
function main(array $arguments): void
{
    $threshold = 0.8;
    $paths = [];

    foreach ($arguments as $argument) {
        if (str_starts_with($argument, '--threshold=')) {
            $threshold = (float) substr($argument, strlen('--threshold='));

            continue;
        }

        $paths[] = $argument;
    }

    $tests = testFacts($paths === [] ? [
        'tests',
        ...glob('domain/*/tests') ?: [],
    ] : $paths);

    echo implode('', array_map(fn (string $line) => $line."\n", [
        ...overlaps($tests, $threshold),
        ...coveredByCommandTests($tests),
    ]));
}

/**
 * Each test method, by "file::method", with the set of facts it rests on.
 *
 * @param  list<string>  $paths
 * @return array<string, list<string>>
 */
function testFacts(array $paths): array
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $finder = new NodeFinder();
    $tests = [];

    foreach ($paths as $path) {
        foreach (phpFiles($path) as $file) {
            if (! str_ends_with($file, 'Test.php')) {
                continue;
            }

            $nodes = parsedOnce($parser, $file, file_get_contents($file));

            foreach ($finder->findInstanceOf($nodes, ClassMethod::class) as $method) {
                if (! str_starts_with($method->name->toString(), 'test_')) {
                    continue;
                }

                $facts = factsOf($finder, $method);

                if (count($facts) >= SMALLEST_SET) {
                    $tests["{$file}::{$method->name->toString()}"] = $facts;
                }
            }
        }
    }

    return $tests;
}

/**
 * The commands a test runs, the classes it names and the assertions it makes, each kept apart by its kind.
 *
 * @return list<string>
 */
function factsOf(NodeFinder $finder, ClassMethod $method): array
{
    $facts = [];

    foreach ($finder->find($method->stmts ?? [], fn (Node $node) => true) as $node) {
        if ($node instanceof New_ && $node->class instanceof Name) {
            $class = $node->class->getLast();
            $facts[] = str_ends_with($class, 'Command') ? "runs {$class}" : "makes {$class}";
        }

        if ($node instanceof StaticCall && $node->class instanceof Name) {
            $facts[] = "uses {$node->class->getLast()}";
        }

        if ($node instanceof MethodCall && $node->name instanceof Node\Identifier
            && str_starts_with($node->name->toString(), 'assert')) {
            $facts[] = "asserts {$node->name->toString()}";
        }
    }

    return array_values(array_unique($facts));
}

/**
 * The pairs of tests whose facts are near-identical, compared only where two tests run, make or use a class in common,
 * since a pair sharing only assertions is no overlap.
 *
 * @param  array<string, list<string>>  $tests
 * @return list<string>
 */
function overlaps(array $tests, float $threshold): array
{
    $lines = [];

    foreach (candidatePairs($tests) as [$first, $second]) {
        $score = jaccard($tests[$first], $tests[$second]);

        if ($score >= $threshold) {
            $lines[] = sprintf("overlap\t%.2f\t%s\t%s", $score, $first, $second);
        }
    }

    return $lines;
}

/**
 * Each pair of tests that share a class fact, once.
 *
 * @param  array<string, list<string>>  $tests
 * @return list<array{string, string}>
 */
function candidatePairs(array $tests): array
{
    $byFact = [];

    foreach ($tests as $name => $facts) {
        foreach ($facts as $fact) {
            if (! str_starts_with($fact, 'asserts ')) {
                $byFact[$fact][] = $name;
            }
        }
    }

    $pairs = [];

    foreach ($byFact as $names) {
        $count = count($names);

        for ($first = 0; $first < $count; $first++) {
            for ($second = $first + 1; $second < $count; $second++) {
                $pairs["{$names[$first]}|{$names[$second]}"] = [
                    $names[$first],
                    $names[$second],
                ];
            }
        }
    }

    return array_values($pairs);
}

/**
 * The tests outside the command test folders whose whole set of facts a command test's set holds.
 *
 * @param  array<string, list<string>>  $tests
 * @return list<string>
 */
function coveredByCommandTests(array $tests): array
{
    $commandTests = array_filter($tests, isCommandTest(...), ARRAY_FILTER_USE_KEY);
    $lines = [];

    foreach ($tests as $name => $facts) {
        if (isCommandTest($name)) {
            continue;
        }

        foreach ($commandTests as $commandTest => $commandFacts) {
            if (array_diff($facts, $commandFacts) === []) {
                $lines[] = sprintf("covered\t%.2f\t%s\t%s", jaccard($facts, $commandFacts), $name, $commandTest);
            }
        }
    }

    return $lines;
}

/**
 * Whether the test sits in a command test folder: tests/Commands/<Subject> or domain/<Domain>/tests/Commands.
 */
function isCommandTest(string $name): bool
{
    return preg_match('#(^|/)Commands/[^/]+Test\.php::#', $name) === 1;
}

/**
 * @param  list<string>  $first
 * @param  list<string>  $second
 */
function jaccard(array $first, array $second): float
{
    $union = count(array_unique([...$first, ...$second]));

    if ($union === 0) {
        return 0.0;
    }

    return count(array_intersect($first, $second)) / $union;
}
