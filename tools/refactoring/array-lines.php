<?php

declare(strict_types=1);

/*
 * Lists every array of two or more entries that does not put each entry on its own line, unless the array is the value
 * of a local variable (user messages 22073, 22083 and 22085). --fix splits each, the outermost first; run it until it
 * lists nothing. An array with comments between its entries, or written as array(), is only listed.
 *
 *   php tools/refactoring/array-lines.php app domain tools
 *   php tools/refactoring/array-lines.php --fix app
 */

use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\ArrayItem;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\Assign;
use PhpParser\Node\Expr\AssignRef;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Identifier;
use PhpParser\Node\Stmt\Class_;
use PhpParser\Node\Stmt\Foreach_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\ParserFactory;

require_once dirname(__DIR__, 2).'/vendor/autoload.php';
require_once __DIR__.'/models.php';
require_once __DIR__.'/php-parse.php';

/**
 * The array the node stands in, through the arrays and entries that hold it; the node itself when no array holds it.
 */
function outermostArrayOf(Node $node): Node
{
    $parent = $node->getAttribute('parent');

    while ($parent instanceof ArrayItem || $parent instanceof Array_) {
        $node = $parent;
        $parent = $node->getAttribute('parent');
    }

    return $node;
}

/**
 * Whether an array may stay on one line: the value of a local variable, the left side of a destructuring, or a
 * validation rule list, in a request class or passed to a validate call (user message 22100).
 */
function mayStayOnOneLine(Array_ $array): bool
{
    $outermost = outermostArrayOf($array);
    $holder = $outermost->getAttribute('parent');

    if (isInRequestClass($array) || isValidationRules($holder)) {
        return true;
    }

    if ($holder instanceof Assign || $holder instanceof AssignRef) {
        return $holder->var === $outermost || $holder->var instanceof Variable;
    }

    return $holder instanceof Foreach_ && ($holder->valueVar === $outermost || $holder->keyVar === $outermost);
}

/**
 * Whether the node sits in a request class: one that extends a class whose name ends in Request.
 */
function isInRequestClass(Node $node): bool
{
    $parent = $node->getAttribute('parent');

    while ($parent !== null && ! $parent instanceof Class_) {
        $parent = $parent->getAttribute('parent');
    }

    if (! $parent instanceof Class_ || $parent->extends === null) {
        return false;
    }

    return str_ends_with($parent->extends->getLast(), 'Request');
}

/**
 * Whether the node is an argument of a validate call, the rules a request is checked against.
 */
function isValidationRules(Node|null $holder): bool
{
    if (! $holder instanceof Arg) {
        return false;
    }

    $call = $holder->getAttribute('parent');

    return $call instanceof MethodCall && $call->name instanceof Identifier && $call->name->toString() === 'validate';
}

/**
 * Whether two entries of the array share a line, or its first entry sits on the line of its opening bracket.
 */
function sharesLines(Array_ $array): bool
{
    $items = array_values(array_filter($array->items));

    if (count($items) < 2) {
        return false;
    }

    $lines = array_map(fn (ArrayItem $item) => $item->getStartLine(), $items);

    return count(array_unique($lines)) < count($lines) || $lines[0] === $array->getStartLine();
}

/**
 * The arrays of a file that break the rule, each once.
 *
 * @param  list<Node>  $ast
 * @return list<Array_>
 */
function crampedArrays(array $ast): array
{
    $traverser = new NodeTraverser(new ParentConnectingVisitor());
    $traverser->traverse($ast);
    $arrays = new NodeFinder()->findInstanceOf($ast, Array_::class);

    return array_values(array_filter($arrays, fn (Array_ $array) => sharesLines($array) && ! mayStayOnOneLine($array)));
}

/**
 * The cramped arrays no other cramped array holds, last first so each rewrite keeps the offsets above it.
 *
 * @param  list<Array_>  $cramped
 * @return list<Array_>
 */
function outermostOf(array $cramped): array
{
    $outermost = array_values(array_filter($cramped, fn (Array_ $inner) => ! array_any(
        $cramped,
        fn (Array_ $outer) => $outer !== $inner
            && $outer->getStartFilePos() <= $inner->getStartFilePos()
            && $outer->getEndFilePos() >= $inner->getEndFilePos(),
    )));
    usort($outermost, fn (Array_ $one, Array_ $other) => $other->getStartFilePos() <=> $one->getStartFilePos());

    return $outermost;
}

/**
 * Whether --fix can split the array from its entries' text alone: short syntax and no comment between entries.
 */
function isSplittable(Array_ $array): bool
{
    if ($array->getAttribute('kind') !== Array_::KIND_SHORT) {
        return false;
    }

    return ! array_any(array_filter($array->items), fn (ArrayItem $item) => $item->getComments() !== []);
}

function indentOfLineAt(string $source, int $position): string
{
    $lineStart = strrpos(substr($source, 0, $position), "\n");
    $lineStart = $lineStart === false ? 0 : $lineStart + 1;
    preg_match('/^[ \t]*/', substr($source, $lineStart), $indent);

    return $indent[0];
}

/**
 * An entry's text moved to a line indented the given way: its later lines move by as much as its first line did.
 */
function movedEntry(string $source, ArrayItem $item, string $indent): string
{
    $text = substr($source, $item->getStartFilePos(), $item->getEndFilePos() + 1 - $item->getStartFilePos());
    $shift = strlen($indent) - strlen(indentOfLineAt($source, $item->getStartFilePos()));

    if ($shift >= 0) {
        return $indent.str_replace("\n", "\n".str_repeat(' ', $shift), $text);
    }

    return $indent.preg_replace('/\n {0,'.(-$shift).'}/', "\n", $text);
}

/**
 * The array written with one entry to a line and a trailing comma, its closing bracket under the line it opens on.
 */
function splitArray(string $source, Array_ $array): string
{
    $indent = indentOfLineAt($source, $array->getStartFilePos());
    $entries = array_map(
        fn (ArrayItem $item) => movedEntry($source, $item, "{$indent}    ").",\n",
        array_values(array_filter($array->items)),
    );

    return "[\n".implode('', $entries)."{$indent}]";
}

/**
 * @param  list<string>  $arguments
 */
function runArrayLines(array $arguments): int
{
    $parser = new ParserFactory()->createForNewestSupportedVersion();
    $fix = in_array('--fix', $arguments, true);
    $faultCount = 0;

    foreach (array_values(array_diff(array_slice($arguments, 1), ['--fix'])) as $path) {
        foreach (phpFiles($path) as $file) {
            $source = (string) file_get_contents($file);
            $cramped = crampedArrays(parsedOnce($parser, $file, $source));

            foreach ($cramped as $array) {
                $faultCount++;
                echo "{$file}:{$array->getStartLine()}\tputs two entries of an array on one line; give each its own\n";
            }

            if (! $fix) {
                continue;
            }

            foreach (outermostOf(array_values(array_filter($cramped, isSplittable(...)))) as $array) {
                $source = substr($source, 0, $array->getStartFilePos())
                    .splitArray($source, $array)
                    .substr($source, $array->getEndFilePos() + 1);
            }

            file_put_contents($file, $source);
        }
    }

    if ($faultCount === 0) {
        return 0;
    }

    return 1;
}

// Run as a command, not when another tool loads these functions.
if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    exit(runArrayLines($argv));
}
