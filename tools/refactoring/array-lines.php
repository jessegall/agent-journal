<?php

declare(strict_types=1);

/*
 * Lists every array of two or more entries that does not put each entry on its own line, unless it is the value of a
 * local variable or an argument that fits its line; an argument split over lines that one line would hold is listed to
 * join. --fix splits or joins each; run it until it lists nothing. A commented array or array() is only listed.
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
 * validation rule list, in a request class or passed to a validate call.
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
 * Whether the array is passed as an argument, or stands inside one, outside a validate call's rules.
 */
function isArgument(Array_ $array): bool
{
    $holder = outermostArrayOf($array)->getAttribute('parent');

    return $holder instanceof Arg && ! isValidationRules($holder);
}

/**
 * The line the array stands on, written with all its entries on that one line.
 */
function joinedLine(string $source, Array_ $array): string
{
    $lineStart = strrpos(substr($source, 0, $array->getStartFilePos()), "\n");
    $lineStart = $lineStart === false ? 0 : $lineStart + 1;
    $lineEnd = strpos($source, "\n", $array->getEndFilePos());
    $lineEnd = $lineEnd === false ? strlen($source) : $lineEnd;

    return substr($source, $lineStart, $array->getStartFilePos() - $lineStart)
        .joinedArray($source, $array)
        .substr($source, $array->getEndFilePos() + 1, $lineEnd - $array->getEndFilePos() - 1);
}

/**
 * The array written on one line, its entries separated by a comma and a space.
 */
function joinedArray(string $source, Array_ $array): string
{
    $entries = array_map(
        fn (ArrayItem $item) => substr($source, $item->getStartFilePos(), $item->getEndFilePos() + 1 - $item->getStartFilePos()),
        array_values(array_filter($array->items)),
    );

    return '['.implode(', ', $entries).']';
}

/**
 * Whether the array is an argument that fits its line once joined: each entry on one line, the line 120 wide at most.
 */
function fitsAsArgument(string $source, Array_ $array): bool
{
    if (! isArgument($array) || ! isSplittable($array)) {
        return false;
    }

    if (array_any(array_filter($array->items), fn (ArrayItem $item) => $item->getStartLine() !== $item->getEndLine())) {
        return false;
    }

    return mb_strlen(joinedLine($source, $array)) <= 120;
}

/**
 * Whether the array is an argument split over lines that one line would hold.
 */
function isJoinable(string $source, Array_ $array): bool
{
    if ($array->getStartLine() === $array->getEndLine() || ! fitsAsArgument($source, $array)) {
        return false;
    }

    return ! sharesItsLineWithSplitArray($source, $array);
}

/**
 * Whether another split array closes on the array's first line or opens on its last, so joining one alone would let
 * the two together outgrow the line.
 */
function sharesItsLineWithSplitArray(string $source, Array_ $array): bool
{
    $lineStart = strrpos(substr($source, 0, $array->getStartFilePos()), "\n");
    $before = substr($source, $lineStart === false ? 0 : $lineStart + 1, $array->getStartFilePos() - ($lineStart === false ? 0 : $lineStart + 1));
    $lineEnd = strpos($source, "\n", $array->getEndFilePos());
    $after = substr($source, $array->getEndFilePos() + 1, ($lineEnd === false ? strlen($source) : $lineEnd) - $array->getEndFilePos() - 1);

    return substr_count($before, ']') > substr_count($before, '[') || substr_count($after, '[') > substr_count($after, ']');
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
function crampedArrays(array $ast, string $source): array
{
    return array_values(array_filter(arraysOf($ast), fn (Array_ $array) => sharesLines($array)
        && ! mayStayOnOneLine($array)
        && ! fitsAsArgument($source, $array)));
}

/**
 * The argument arrays of a file split over lines that one line would hold, last first.
 *
 * @param  list<Node>  $ast
 * @return list<Array_>
 */
function joinableArrays(array $ast, string $source): array
{
    $joinable = array_values(array_filter(arraysOf($ast), fn (Array_ $array) => isJoinable($source, $array)));
    usort($joinable, fn (Array_ $one, Array_ $other) => $other->getStartFilePos() <=> $one->getStartFilePos());

    return $joinable;
}

/**
 * Every array of a file, each knowing what holds it.
 *
 * @param  list<Node>  $ast
 * @return list<Array_>
 */
function arraysOf(array $ast): array
{
    $traverser = new NodeTraverser(new ParentConnectingVisitor());
    $traverser->traverse($ast);

    return new NodeFinder()->findInstanceOf($ast, Array_::class);
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
 * The source with each joinable array written on one line; an array inside one already joined waits for the next run.
 *
 * @param  list<Array_>  $joinable  last first
 */
function joined(string $source, array $joinable): string
{
    $joinedFrom = PHP_INT_MAX;

    foreach ($joinable as $array) {
        if ($array->getEndFilePos() >= $joinedFrom) {
            continue;
        }

        $source = substr($source, 0, $array->getStartFilePos())
            .joinedArray($source, $array)
            .substr($source, $array->getEndFilePos() + 1);
        $joinedFrom = $array->getStartFilePos();
    }

    return $source;
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
            $ast = parsedOnce($parser, $file, $source);
            $cramped = crampedArrays($ast, $source);
            $joinable = joinableArrays($ast, $source);

            foreach ($cramped as $array) {
                $faultCount++;
                echo "{$file}:{$array->getStartLine()}\tputs two entries of an array on one line; give each its own\n";
            }

            foreach ($joinable as $array) {
                $faultCount++;
                echo "{$file}:{$array->getStartLine()}\tsplits an argument array that fits one line; join it\n";
            }

            if (! $fix) {
                continue;
            }

            if ($joinable !== []) {
                file_put_contents($file, joined($source, $joinable));

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
