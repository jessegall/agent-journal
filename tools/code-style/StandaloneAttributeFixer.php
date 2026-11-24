<?php

declare(strict_types=1);

namespace Tools\CodeStyle;

use PhpCsFixer\Fixer\FixerInterface;
use PhpCsFixer\FixerDefinition\CodeSample;
use PhpCsFixer\FixerDefinition\FixerDefinition;
use PhpCsFixer\FixerDefinition\FixerDefinitionInterface;
use PhpCsFixer\Tokenizer\CT;
use PhpCsFixer\Tokenizer\Token;
use PhpCsFixer\Tokenizer\Tokens;
use SplFileInfo;

/**
 * An attribute on a property or a promoted constructor parameter sits on its own line above it, never in front of it
 * on the same line.
 */
final class StandaloneAttributeFixer implements FixerInterface
{
    /**
     * The words that open a property or a promoted parameter after its attributes.
     */
    private const array MODIFIERS = [
        T_PUBLIC, T_PROTECTED, T_PRIVATE, T_READONLY, T_VAR, T_STATIC,
        CT::T_CONSTRUCTOR_PROPERTY_PROMOTION_PUBLIC,
        CT::T_CONSTRUCTOR_PROPERTY_PROMOTION_PROTECTED,
        CT::T_CONSTRUCTOR_PROPERTY_PROMOTION_PRIVATE,
    ];

    public function getName(): string
    {
        return 'Journal/standalone_attribute';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'An attribute on a property or a promoted parameter stands on its own line above it.',
            [new CodeSample("<?php\nclass A\n{\n    #[Hidden] public string \$name;\n}\n")],
        );
    }

    public function isCandidate(Tokens $tokens): bool
    {
        return $tokens->isTokenKindFound(T_ATTRIBUTE);
    }

    public function isRisky(): bool
    {
        return false;
    }

    public function getPriority(): int
    {
        return -30;
    }

    public function supports(SplFileInfo $file): bool
    {
        return true;
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        for ($index = $tokens->count() - 1; $index >= 0; $index--) {
            if (! $tokens[$index]->isGivenKind(T_ATTRIBUTE)) {
                continue;
            }

            $close = $tokens->findBlockEnd(Tokens::BLOCK_TYPE_ATTRIBUTE, $index);
            $gap = $tokens[$close + 1];

            if (! $gap->isWhitespace() || str_contains($gap->getContent(), "\n") || ! $this->marksAPropertyAt($tokens, $close + 2)) {
                continue;
            }

            $tokens[$close + 1] = new Token([T_WHITESPACE, "\n".$this->indentationOf($tokens, $index)]);
        }
    }

    /**
     * Whether the code at the index declares a property or a promoted parameter: its modifiers, then a type or not,
     * then its variable, with no function or constant among them.
     */
    private function marksAPropertyAt(Tokens $tokens, int $index): bool
    {
        if (! $tokens[$index]->isGivenKind(self::MODIFIERS)) {
            return false;
        }

        for ($next = $index; $next < $tokens->count(); $next++) {
            $token = $tokens[$next];

            if ($token->isGivenKind(T_VARIABLE)) {
                return true;
            }

            if ($token->isGivenKind([T_FUNCTION, T_CONST, T_CASE]) || $token->equalsAny([';', '{', '(', '='])) {
                return false;
            }
        }

        return false;
    }

    /**
     * The white space that opens the attribute's own line.
     */
    private function indentationOf(Tokens $tokens, int $index): string
    {
        $before = $tokens[$index - 1];

        if (! $before->isWhitespace()) {
            return '';
        }

        $lines = explode("\n", $before->getContent());

        return end($lines);
    }
}
