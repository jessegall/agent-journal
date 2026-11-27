<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * No return hands back a ternary: a choice is an if with an early return and a plain return after it (user messages
 * 21961 to 21966). A short ternary (?:) stays, as its condition would run twice, and so does a return whose value
 * holds a closure, whose own colons and question marks are no part of the choice.
 */
final class TernaryReturnFixer implements FixerInterface
{
    /**
     * The most rewrites of one file, so a nested choice is rewritten level by level and a fault never loops.
     */
    private const int MOST_REWRITES = 1000;

    public function getName(): string
    {
        return 'Journal/ternary_return';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'A return of a ternary becomes an if with an early return and a plain return after it.',
            [new CodeSample("<?php\nfunction a(bool \$b): int\n{\n    return \$b ? 1 : 2;\n}\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isAllTokenKindsFound([T_RETURN, '?']);
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        // Before the blank line fixers, which then see the if it writes.
        return 10;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain', 'tools'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        for ($rewrites = 0; $rewrites < self::MOST_REWRITES && $this->rewriteOne($tokens); $rewrites++) {
            continue;
        }
    }

    /**
     * Rewrites the last return of a ternary in the file; answers whether there was one.
     */
    private function rewriteOne(Tokens $tokens): bool
    {
        foreach (array_reverse(array_keys($tokens->findGivenKind(T_RETURN))) as $return) {
            $end = $this->statementEnd($tokens, $return);

            if ($end === null || $this->holdsClosure($tokens, $return, $end)) {
                continue;
            }

            $question = $this->topLevel($tokens, $return + 1, $end, '?');

            if ($question === null || $tokens[$tokens->getNextMeaningfulToken($question)]->equals(':')) {
                continue;
            }

            $colon = $this->matchingColon($tokens, $question, $end);

            if ($colon === null) {
                continue;
            }

            $this->rewrite($tokens, $return, $question, $colon, $end);

            return true;
        }

        return false;
    }

    private function rewrite(Tokens $tokens, int $return, int $question, int $colon, int $end): void
    {
        $indent = $this->indentBefore($tokens, $return);
        $condition = trim($tokens->generatePartialCode($return + 1, $question - 1));
        $early = $this->exitWith(trim($tokens->generatePartialCode($question + 1, $colon - 1)));
        $chosen = str_replace("\n", "\n    ", $early);
        $otherwise = $this->exitWith(trim($tokens->generatePartialCode($colon + 1, $end - 1)));
        $code = "if ({$condition}) {\n{$indent}    {$chosen}\n{$indent}}\n\n{$indent}{$otherwise}";
        $written = Tokens::fromCode("<?php {$code}");
        $written->clearAt(0);
        $written->clearEmptyTokens();
        $tokens->overrideRange($return, $end, $written);
    }

    /**
     * The statement that hands back a branch: a throw stays a throw, anything else is returned.
     */
    private function exitWith(string $branch): string
    {
        if (str_starts_with($branch, 'throw ')) {
            return "{$branch};";
        }

        return "return {$branch};";
    }

    /**
     * The semicolon that ends the statement the token starts, past every bracket in it.
     */
    private function statementEnd(Tokens $tokens, int $start): int|null
    {
        for ($index = $start + 1; $index < $tokens->count(); $index++) {
            $block = Tokens::detectBlockType($tokens[$index]);

            if ($block !== null && $block['isStart']) {
                $index = $tokens->findBlockEnd($block['type'], $index);

                continue;
            }

            if ($tokens[$index]->equals(';')) {
                return $index;
            }
        }

        return null;
    }

    private function holdsClosure(Tokens $tokens, int $start, int $end): bool
    {
        for ($index = $start; $index < $end; $index++) {
            if ($tokens[$index]->isGivenKind([T_FUNCTION, T_FN, T_MATCH])) {
                return true;
            }
        }

        return false;
    }

    /**
     * The first token that is the character outside every bracket between the two tokens.
     */
    private function topLevel(Tokens $tokens, int $from, int $to, string $character): int|null
    {
        for ($index = $from; $index < $to; $index++) {
            $block = Tokens::detectBlockType($tokens[$index]);

            if ($block !== null && $block['isStart']) {
                $index = $tokens->findBlockEnd($block['type'], $index);

                continue;
            }

            if ($tokens[$index]->equals($character)) {
                return $index;
            }
        }

        return null;
    }

    /**
     * The colon that closes the ternary the question mark opens, past the ternaries nested in its first branch.
     */
    private function matchingColon(Tokens $tokens, int $question, int $end): int|null
    {
        $open = 1;

        for ($index = $question + 1; $index < $end; $index++) {
            $block = Tokens::detectBlockType($tokens[$index]);

            if ($block !== null && $block['isStart']) {
                $index = $tokens->findBlockEnd($block['type'], $index);

                continue;
            }

            $open += match (true) {
                $tokens[$index]->equals('?') => 1,
                $tokens[$index]->equals(':') => -1,
                default => 0,
            };

            if ($open === 0) {
                return $index;
            }
        }

        return null;
    }

    private function indentBefore(Tokens $tokens, int $index): string
    {
        $before = $tokens[$index - 1];

        if (! $before->isWhitespace()) {
            return '';
        }

        $lines = explode("\n", $before->getContent());

        return $lines[count($lines) - 1];
    }
}
