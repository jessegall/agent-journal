<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\InterpolatedStringPart;
use PhpParser\Node\Scalar\InterpolatedString;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Each assertion of a test that takes a literal sentence, a string literal with white space between two words, as
 * one of its own arguments, values put into it included: its line and the sentence (user messages 16018, 16024).
 *
 * @implements FileScan<array{line: int, sentence: string}>
 */
final readonly class LiteralSentenceAssertionScan implements FileScan
{
    public function key(): string
    {
        return 'literal-sentence-assertions-3';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];

        foreach (new NodeFinder()->find($file->statements, fn (Node $node) => self::isAssertion($node)) as $call) {
            foreach (self::sentencesOf($call) as $sentence) {
                $findings[] = ['line' => $call->getStartLine(), 'sentence' => $sentence];
            }
        }

        return $findings;
    }

    private static function isAssertion(Node $node): bool
    {
        if (! $node instanceof Expr\MethodCall && ! $node instanceof Expr\StaticCall) {
            return false;
        }

        return $node->name instanceof Node\Identifier
            && preg_match('/^(assert|expectExceptionMessage)/', $node->name->toString()) === 1;
    }

    /**
     * The literal sentences handed to the call itself, not those inside a call or construction among its arguments.
     *
     * @return list<string>
     */
    private static function sentencesOf(Expr\MethodCall|Expr\StaticCall $call): array
    {
        $sentences = [];

        foreach ($call->getArgs() as $argument) {
            $text = self::literalTextOf($argument->value);

            if ($text !== null && preg_match('/\S\s+\S/', $text) === 1) {
                $sentences[] = $text;
            }
        }

        return $sentences;
    }

    /**
     * The words a string literal writes, joined or with values put into it, each value read as one word; none for
     * an expression that holds no literal.
     */
    private static function literalTextOf(Expr $value): string|null
    {
        if ($value instanceof String_) {
            return $value->value;
        }

        if ($value instanceof Expr\BinaryOp\Concat) {
            $left = self::literalTextOf($value->left);
            $right = self::literalTextOf($value->right);

            return $left === null && $right === null ? null : ($left ?? 'value').($right ?? 'value');
        }

        if (! $value instanceof InterpolatedString) {
            return null;
        }

        return implode('', array_map(
            fn (Node $part) => $part instanceof InterpolatedStringPart ? $part->value : 'value',
            $value->parts,
        ));
    }
}
