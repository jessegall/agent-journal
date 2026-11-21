<?php

declare(strict_types=1);

/**
 * Sets a statement that spans several lines apart by a blank line above and below, unless it is the first or last
 * statement of its block (user message 13592). A run of one-line statements stays together.
 *
 *   php tools/refactoring/blank-line-around-multiline-statement.php app domain tests
 *   php tools/refactoring/blank-line-around-multiline-statement.php --check app domain tests
 *       lists each place instead and fails while there is one.
 *
 * It judges expression statements, such as an assignment of a multi-line array or a call split over lines; an if, a
 * loop and a return already get their lines from Pint and the closing-brace rule. A comment above a statement belongs
 * to it, so the blank line goes above the comment.
 */

use PhpParser\Node;
use PhpParser\Node\Stmt;
use PhpParser\Node\Stmt\Expression;
use PhpParser\Node\Stmt\Nop;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/php-files.php';

/**
 * The first line a statement takes, its comments included.
 */
function firstLineOf(Stmt $statement): int
{
    $comments = $statement->getComments();

    return $comments === [] ? $statement->getStartLine() : min($comments[0]->getStartLine(), $statement->getStartLine());
}

/**
 * Every list of statements in the file: a function's body, a branch's, a loop's, a closure's.
 *
 * @param  list<Stmt>  $statements
 * @return list<list<Stmt>>
 */
function statementLists(array $statements): array
{
    $lists = [$statements];

    foreach (new NodeFinder()->find($statements, fn (Node $node): bool => true) as $node) {
        foreach ($node->getSubNodeNames() as $name) {
            $value = $node->{$name};

            if (is_array($value) && $value !== [] && array_is_list($value) && $value[0] instanceof Stmt) {
                $lists[] = $value;
            }
        }
    }

    return $lists;
}

/**
 * The line numbers after which a blank line is wanted: above and below each multi-line expression statement that is
 * neither first nor last of its block and touches its neighbour.
 *
 * @param  list<Stmt>  $statements
 * @return list<int>
 */
function wantedBlankLines(array $statements): array
{
    $after = [];

    foreach (statementLists($statements) as $list) {
        $list = array_values(array_filter($list, fn (Stmt $statement): bool => ! $statement instanceof Nop));

        foreach ($list as $index => $statement) {
            if (! $statement instanceof Expression || $statement->getEndLine() === $statement->getStartLine()) {
                continue;
            }

            $previous = $list[$index - 1] ?? null;
            $next = $list[$index + 1] ?? null;

            if ($previous !== null && $previous->getEndLine() === firstLineOf($statement) - 1) {
                $after[] = $previous->getEndLine();
            }

            if ($next !== null && firstLineOf($next) === $statement->getEndLine() + 1) {
                $after[] = $statement->getEndLine();
            }
        }
    }

    $after = array_values(array_unique($after));
    sort($after);

    return $after;
}

$check = ($argv[1] ?? '') === '--check';
$paths = array_slice($argv, $check ? 2 : 1);
$parser = new ParserFactory()->createForNewestSupportedVersion();
$places = 0;

foreach (phpFiles($paths) as $file) {
    $code = (string) file_get_contents($file);
    $after = wantedBlankLines($parser->parse($code) ?? []);

    if ($after === []) {
        continue;
    }

    $places += count($after);

    if ($check) {
        foreach ($after as $number) {
            echo "{$file}:{$number}\n";
        }

        continue;
    }

    $lines = explode("\n", $code);

    foreach (array_reverse($after) as $number) {
        array_splice($lines, $number, 0, ['']);
    }

    file_put_contents($file, implode("\n", $lines));
}

echo $check
    ? "{$places} places want a blank line around a statement of several lines\n"
    : "{$places} blank lines added\n";

exit($check && $places > 0 ? 1 : 0);
