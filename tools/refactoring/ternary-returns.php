<?php

declare(strict_types=1);

/*
 * Lists every return of a ternary, and rewrites each with --fix as an if with an early return and a plain return after
 * it (user messages 21961 to 21966). A short ternary (?:) is only listed: its condition would run twice.
 *
 *   php tools/refactoring/ternary-returns.php app domain tools
 *   php tools/refactoring/ternary-returns.php --fix app
 */

use PhpParser\Node;
use PhpParser\Node\Expr\Ternary;
use PhpParser\Node\Expr\Throw_;
use PhpParser\Node\Stmt\Return_;
use PhpParser\NodeFinder;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/**
 * The returns of a ternary in a file's source, outermost only, last first so each rewrite keeps the offsets above it.
 *
 * @return list<Return_>
 */
function ternaryReturns(array $ast): array
{
    $returns = array_values(array_filter(
        new NodeFinder()->findInstanceOf($ast, Return_::class),
        fn (Return_ $return) => $return->expr instanceof Ternary,
    ));
    $outermost = array_values(array_filter($returns, fn (Return_ $inner) => ! array_any(
        $returns,
        fn (Return_ $outer) => $outer !== $inner
            && $outer->getStartFilePos() < $inner->getStartFilePos()
            && $outer->getEndFilePos() > $inner->getEndFilePos(),
    )));
    usort($outermost, fn (Return_ $one, Return_ $other) => $other->getStartFilePos() <=> $one->getStartFilePos());

    return $outermost;
}

function textOfNode(string $source, Node $node): string
{
    return substr($source, $node->getStartFilePos(), $node->getEndFilePos() + 1 - $node->getStartFilePos());
}

/**
 * The statement that hands back a branch: a throw stays a throw, anything else is returned.
 */
function exitWith(string $source, Node $branch, string $indent): string
{
    $text = textOfNode($source, $branch);

    if ($branch instanceof Throw_) {
        return "{$indent}{$text};";
    }

    return "{$indent}return {$text};";
}

/**
 * Moves every line after a text's first by the extra indentation, so a branch keeps its shape one level deeper.
 */
function indented(string $text, string $extra): string
{
    return str_replace("\n", "\n{$extra}", $text);
}

/**
 * The if with an early return that replaces one return of a ternary.
 */
function rewritten(string $source, Return_ $return): string
{
    $ternary = $return->expr;
    assert($ternary instanceof Ternary && $ternary->if !== null);
    $lineStart = strrpos(substr($source, 0, $return->getStartFilePos()), "\n") + 1;
    $indent = substr($source, $lineStart, $return->getStartFilePos() - $lineStart);
    $condition = textOfNode($source, $ternary->cond);
    $early = indented(exitWith($source, $ternary->if, "{$indent}    "), '    ');

    return "if ({$condition}) {\n{$early}\n{$indent}}\n\n".exitWith($source, $ternary->else, $indent);
}

/**
 * @param  list<string>  $arguments
 */
function runTernaryReturns(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $fix = in_array('--fix', $arguments, true);
    $faultCount = 0;

    foreach (array_values(array_diff(array_slice($arguments, 1), ['--fix'])) as $path) {
        foreach (phpFiles($path) as $file) {
            $source = (string) file_get_contents($file);

            foreach (ternaryReturns(parsedOnce($parser, $file, $source)) as $return) {
                $isShort = $return->expr instanceof Ternary && $return->expr->if === null;

                if (! $fix || $isShort) {
                    $faultCount++;
                    echo "{$file}:{$return->getStartLine()}\treturns a ternary; write an if with an early return\n";

                    continue;
                }

                $source = substr($source, 0, $return->getStartFilePos())
                    .rewritten($source, $return)
                    .substr($source, $return->getEndFilePos() + 1);
            }

            if ($fix) {
                file_put_contents($file, $source);
            }
        }
    }

    return $faultCount === 0 ? 0 : 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runTernaryReturns($argv));
}
