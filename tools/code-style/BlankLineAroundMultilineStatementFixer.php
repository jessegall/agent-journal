<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\Token;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * A statement of several lines stands apart by a blank line above and below, unless it is the first or last of its
 * block, while one-line statements in a row stay together. Only expression statements count, as
 * a control structure already gets its blank line from blank_line_before_statement.
 */
final class BlankLineAroundMultilineStatementFixer implements FixerInterface
{
    /**
     * The first tokens of a statement that is not an expression statement.
     */
    private const array NOT_EXPRESSIONS = [
        T_ABSTRACT,
        T_BREAK,
        T_CASE,
        T_CLASS,
        T_CONST,
        T_CONTINUE,
        T_DECLARE,
        T_DEFAULT,
        T_DO,
        T_ECHO,
        T_ELSE,
        T_ELSEIF,
        T_ENUM,
        T_FINAL,
        T_FOR,
        T_FOREACH,
        T_FUNCTION,
        T_GLOBAL,
        T_GOTO,
        T_IF,
        T_INTERFACE,
        T_NAMESPACE,
        T_PRIVATE,
        T_PROTECTED,
        T_PUBLIC,
        T_READONLY,
        T_RETURN,
        T_SWITCH,
        T_TRAIT,
        T_TRY,
        T_UNSET,
        T_USE,
        T_VAR,
        T_WHILE,
        T_ATTRIBUTE,
        T_INLINE_HTML,
        T_OPEN_TAG,
        T_CATCH,
        T_FINALLY,
        T_THROW,
    ];

    public function getName(): string
    {
        return 'Journal/blank_line_around_multiline_statement';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'A statement of several lines stands apart by a blank line above and below, unless it opens or closes its block.',
            [new CodeSample("<?php\n\$a = 1;\n\$b = [\n    \$a,\n];\n\$c = \$b;\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound(';');
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        return -50;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        for ($end = $tokens->count() - 1; $end >= 0; $end--) {
            if (! $tokens[$end]->equals(';')) {
                continue;
            }

            $start = $this->statementStart($tokens, $end);

            if ($start === null || ! $this->isMultilineExpression($tokens, $start, $end)) {
                continue;
            }

            $this->openLineAfter($tokens, $end);
            $this->openLineBefore($tokens, $start);
        }
    }

    /**
     * The first token of the statement a semicolon ends, or none when the semicolon is not at statement level.
     */
    private function statementStart(Tokens $tokens, int $end): int|null
    {
        $index = $end - 1;

        while ($index > 0) {
            $token = $tokens[$index];

            if ($token->equals(';') || $token->isGivenKind(T_OPEN_TAG)) {
                return $tokens->getNextMeaningfulToken($index);
            }

            $block = Tokens::detectBlockType($token);

            if ($block === null) {
                $index--;

                continue;
            }

            if ($block['isStart']) {
                if ($token->equals('{')) {
                    return $tokens->getNextMeaningfulToken($index);
                }

                return null;
            }

            if ($token->equals('}') && ! $this->continuesTheStatement($tokens, $index)) {
                return $tokens->getNextMeaningfulToken($index);
            }

            $index = $tokens->findBlockStart($block['type'], $index) - 1;
        }

        return null;
    }

    /**
     * Whether the code after a closing brace goes on with the same statement, as after a closure or a match, rather
     * than starting a new one, as after an if block or a method.
     */
    private function continuesTheStatement(Tokens $tokens, int $closingBrace): bool
    {
        $next = $tokens->getNextMeaningfulToken($closingBrace);

        return $next !== null
            && $tokens[$next]->equalsAny([
                ';',
                ')',
                ',',
                ']',
                '(',
                '[',
                [T_OBJECT_OPERATOR],
                [T_NULLSAFE_OBJECT_OPERATOR],
                [T_DOUBLE_COLON],
            ]);
    }

    private function isMultilineExpression(Tokens $tokens, int $start, int $end): bool
    {
        if ($tokens[$start]->isGivenKind(self::NOT_EXPRESSIONS)) {
            return false;
        }

        for ($index = $start; $index < $end; $index++) {
            if (str_contains($tokens[$index]->getContent(), "\n")) {
                return true;
            }
        }

        return false;
    }

    /**
     * Adds a blank line above the statement and its own comments, unless it opens its block.
     */
    private function openLineBefore(Tokens $tokens, int $start): void
    {
        $previous = $tokens->getPrevMeaningfulToken($start);

        if ($previous === null || $tokens[$previous]->equalsAny([
            '{',
            ':',
        ]) || $tokens[$previous]->isGivenKind(T_OPEN_TAG)) {
            return;
        }

        $this->widen($tokens, $previous + 1);
    }

    /**
     * Adds a blank line below the statement, unless it closes its block.
     */
    private function openLineAfter(Tokens $tokens, int $end): void
    {
        $next = $tokens->getNextMeaningfulToken($end);

        if ($next === null || $tokens[$next]->equals('}')) {
            return;
        }

        $gap = $end + 1;

        if ($tokens[$gap]->isWhitespace() && ! str_contains($tokens[$gap]->getContent(), "\n") && $tokens[$gap + 1]->isComment()) {
            $gap += 2;
        }

        $this->widen($tokens, $gap);
    }

    /**
     * Turns a gap of one line break into a blank line; a gap on the same line, or one already blank, stays.
     */
    private function widen(Tokens $tokens, int $index): void
    {
        $token = $tokens[$index];

        if (! $token->isWhitespace() || substr_count($token->getContent(), "\n") !== 1) {
            return;
        }

        $tokens[$index] = new Token([T_WHITESPACE, "\n".$token->getContent()]);
    }
}
