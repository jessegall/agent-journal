<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpParser\Error;
use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\ArrayItem;
use PhpParser\Node\Expr\Array_;
use PhpParser\Node\Expr\Assign;
use PhpParser\Node\Expr\AssignRef;
use PhpParser\Node\Stmt\Foreach_;
use PhpParser\NodeFinder;
use PhpParser\NodeTraverser;
use PhpParser\NodeVisitor\ParentConnectingVisitor;
use PhpParser\Parser;
use PhpParser\ParserFactory;
use PhpParser\Token;

/**
 * Lays arrays out as rule 111 says: two or more entries go one to a line when returned, assigned or too wide for 120
 * characters; an argument that fits stays on one line, and a split one that fits is joined. Commented arrays,
 * arrays containing multiline literals, array() and destructuring are left as they are.
 */
final readonly class ArrayLayout
{
    private const int LINE_WIDTH = 120;

    /**
     * The most passes over one source: each pass joins or splits the outermost arrays, so nested ones need more.
     */
    private const int MOST_PASSES = 20;

    private Parser $parser;

    public function __construct()
    {
        $this->parser = new ParserFactory()->createForNewestSupportedVersion();
    }

    /**
     * The source with every array laid out, pass after pass until a pass changes nothing.
     */
    public function laidOut(string $source): string
    {
        $current = $source;

        for ($pass = 0; $pass < self::MOST_PASSES; $pass++) {
            $next = $this->onePass($current);

            if ($next === $current) {
                return $current;
            }

            $current = $next;
        }

        return $current;
    }

    private function onePass(string $source): string
    {
        $arrays = $this->arraysOf($source);
        $joinable = array_values(array_filter($arrays, fn (Array_ $array) => $this->isJoinable($source, $array)));

        if ($joinable !== []) {
            return $this->rewritten($source, $joinable, fn (Array_ $array) => $this->joinedArray($source, $array));
        }

        $cramped = array_values(array_filter($arrays, fn (Array_ $array) => $this->isSplittable($array)
            && $this->sharesLines($array)
            && ! $this->isDestructuring($array)
            && ! $this->fitsAsArgument($source, $array)));

        return $this->rewritten($source, $cramped, fn (Array_ $array) => $this->splitArray($source, $array));
    }

    /**
     * The source with each outermost of the arrays written anew, last first so each keeps the offsets above it.
     *
     * @param  list<Array_>  $arrays
     * @param  callable(Array_): string  $written
     */
    private function rewritten(string $source, array $arrays, callable $written): string
    {
        $outermost = array_values(array_filter($arrays, fn (Array_ $inner) => ! array_any(
            $arrays,
            fn (Array_ $outer) => $outer !== $inner
                && $outer->getStartFilePos() <= $inner->getStartFilePos()
                && $outer->getEndFilePos() >= $inner->getEndFilePos(),
        )));
        usort($outermost, fn (Array_ $one, Array_ $other) => $other->getStartFilePos() <=> $one->getStartFilePos());
        $result = $source;

        foreach ($outermost as $array) {
            $result = substr($result, 0, $array->getStartFilePos())
                .$written($array)
                .substr($result, $array->getEndFilePos() + 1);
        }

        return $result;
    }

    /**
     * Every array of the source, each knowing what holds it; none when the source does not parse.
     *
     * @return list<Array_>
     */
    private function arraysOf(string $source): array
    {
        try {
            $ast = $this->parser->parse($source) ?? [];
        } catch (Error) {
            // A file that does not parse is left for PHP to name its fault.
            return [];
        }

        new NodeTraverser(new ParentConnectingVisitor())->traverse($ast);

        $tokens = $this->parser->getTokens();
        $arrays = new NodeFinder()->findInstanceOf($ast, Array_::class);

        return array_values(array_filter($arrays, fn (Array_ $array) => $this->canMoveEntries($array, $tokens)));
    }

    /** @param list<Token> $tokens */
    private function canMoveEntries(Array_ $array, array $tokens): bool
    {
        $start = $array->getStartTokenPos();
        $inside = array_slice($tokens, $start, $array->getEndTokenPos() - $start + 1);

        return ! array_any($inside, fn (Token $token) => $token->is([T_COMMENT, T_DOC_COMMENT, T_START_HEREDOC])
            || ($token->is([T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_INLINE_HTML])
                && str_contains($token->text, "\n")));
    }

    /**
     * The array the node stands in, through the arrays and entries that hold it; the node itself when none does.
     */
    private function outermostArrayOf(Node $node): Node
    {
        $parent = $node->getAttribute('parent');

        while ($parent instanceof ArrayItem || $parent instanceof Array_) {
            $node = $parent;
            $parent = $node->getAttribute('parent');
        }

        return $node;
    }

    /**
     * Whether the array is the left side of a destructuring, whose entries are names to fill.
     */
    private function isDestructuring(Array_ $array): bool
    {
        $outermost = $this->outermostArrayOf($array);
        $holder = $outermost->getAttribute('parent');

        if ($holder instanceof Assign || $holder instanceof AssignRef) {
            return $holder->var === $outermost;
        }

        return $holder instanceof Foreach_ && ($holder->valueVar === $outermost || $holder->keyVar === $outermost);
    }

    private function isArgument(Array_ $array): bool
    {
        return $this->outermostArrayOf($array)->getAttribute('parent') instanceof Arg;
    }

    /**
     * Whether the array is an argument that fits its line once joined: each entry on one line, the line 120 wide.
     */
    private function fitsAsArgument(string $source, Array_ $array): bool
    {
        if (! $this->isArgument($array) || ! $this->isSplittable($array)) {
            return false;
        }

        $items = array_values(array_filter($array->items));

        if (array_any($items, fn (ArrayItem $item) => $item->getStartLine() !== $item->getEndLine())) {
            return false;
        }

        return mb_strlen($this->joinedLine($source, $array)) <= self::LINE_WIDTH;
    }

    /**
     * Whether the array is an argument split over lines that one line would hold.
     */
    private function isJoinable(string $source, Array_ $array): bool
    {
        if ($array->getStartLine() === $array->getEndLine() || ! $this->fitsAsArgument($source, $array)) {
            return false;
        }

        return ! $this->sharesItsLineWithSplitArray($source, $array);
    }

    /**
     * Whether another split array closes on the array's first line or opens on its last, so joining one alone would
     * let the two together outgrow the line.
     */
    private function sharesItsLineWithSplitArray(string $source, Array_ $array): bool
    {
        $lineStart = $this->lineStartOf($source, $array->getStartFilePos());
        $before = substr($source, $lineStart, $array->getStartFilePos() - $lineStart);
        $after = substr($source, $array->getEndFilePos() + 1, $this->lineEndOf($source, $array->getEndFilePos())
            - $array->getEndFilePos() - 1);
        $closesBefore = substr_count($before, ']') > substr_count($before, '[');

        return $closesBefore || substr_count($after, '[') > substr_count($after, ']');
    }

    /**
     * Whether two entries of the array share a line, or its first entry sits on the line of its opening bracket.
     */
    private function sharesLines(Array_ $array): bool
    {
        $items = array_values(array_filter($array->items));

        if (count($items) < 2) {
            return false;
        }

        $lines = array_map(fn (ArrayItem $item) => $item->getStartLine(), $items);

        return count(array_unique($lines)) < count($lines) || $lines[0] === $array->getStartLine();
    }

    /**
     * Whether the array can be laid out from its entries' text alone: short syntax and no comment between entries.
     */
    private function isSplittable(Array_ $array): bool
    {
        if ($array->getAttribute('kind') !== Array_::KIND_SHORT) {
            return false;
        }

        return ! array_any(array_filter($array->items), fn (ArrayItem $item) => $item->getComments() !== []);
    }

    /**
     * The line the array stands on, written with all its entries on that one line.
     */
    private function joinedLine(string $source, Array_ $array): string
    {
        $lineStart = $this->lineStartOf($source, $array->getStartFilePos());
        $lineEnd = $this->lineEndOf($source, $array->getEndFilePos());

        return substr($source, $lineStart, $array->getStartFilePos() - $lineStart)
            .$this->joinedArray($source, $array)
            .substr($source, $array->getEndFilePos() + 1, $lineEnd - $array->getEndFilePos() - 1);
    }

    /**
     * The array written on one line, its entries separated by a comma and a space.
     */
    private function joinedArray(string $source, Array_ $array): string
    {
        $entries = array_map(
            fn (ArrayItem $item) => $this->textOf($source, $item),
            array_values(array_filter($array->items)),
        );

        return '['.implode(', ', $entries).']';
    }

    /**
     * The array written one entry a line with a trailing comma, its closing bracket under the line it opens on.
     */
    private function splitArray(string $source, Array_ $array): string
    {
        $indent = $this->indentOfLineAt($source, $array->getStartFilePos());
        $entries = array_map(
            fn (ArrayItem $item) => $this->movedEntry($source, $item, "{$indent}    ").",\n",
            array_values(array_filter($array->items)),
        );

        return "[\n".implode('', $entries)."{$indent}]";
    }

    /**
     * An entry's text moved to a line indented the given way: its later lines move by as much as its first did.
     */
    private function movedEntry(string $source, ArrayItem $item, string $indent): string
    {
        $text = $this->textOf($source, $item);
        $shift = strlen($indent) - strlen($this->indentOfLineAt($source, $item->getStartFilePos()));

        if ($shift >= 0) {
            return $indent.str_replace("\n", "\n".str_repeat(' ', $shift), $text);
        }

        return $indent.preg_replace('/\n {0,'.(-$shift).'}/', "\n", $text);
    }

    private function textOf(string $source, Node $node): string
    {
        return substr($source, $node->getStartFilePos(), $node->getEndFilePos() + 1 - $node->getStartFilePos());
    }

    private function indentOfLineAt(string $source, int $position): string
    {
        preg_match('/^[ \t]*/', substr($source, $this->lineStartOf($source, $position)), $indent);

        return $indent[0];
    }

    private function lineStartOf(string $source, int $position): int
    {
        $newline = strrpos(substr($source, 0, $position), "\n");

        if ($newline === false) {
            return 0;
        }

        return $newline + 1;
    }

    private function lineEndOf(string $source, int $position): int
    {
        $newline = strpos($source, "\n", $position);

        if ($newline === false) {
            return strlen($source);
        }

        return $newline;
    }
}
