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
 * Attributes stacked on one declaration, each on its own line, stand shortest first; groups of the same length keep
 * their order.
 */
final class AttributeOrderFixer implements FixerInterface
{
    public function getName(): string
    {
        return 'Journal/attribute_order';
    }

    public function getDefinition(): FixerDefinitionInterface
    {
        return new FixerDefinition(
            'Attributes stacked on one declaration stand shortest first.',
            [new CodeSample("<?php\n#[Deprecated(message: 'old')]\n#[Override]\nfunction f() {}\n")],
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
        return -40;
    }

    public function supports(SplFileInfo $file): bool
    {
        return new ProjectFolders(['app', 'domain'])->holds($file);
    }

    public function fix(SplFileInfo $file, Tokens $tokens): void
    {
        for ($index = $tokens->count() - 1; $index >= 0; $index--) {
            if (! $tokens[$index]->isGivenKind(T_ATTRIBUTE) || $this->continuesARun($tokens, $index)) {
                continue;
            }

            $this->sortRunFrom($tokens, $index);
        }
    }

    /**
     * Whether the attribute group opening at the index follows another on the line above it.
     */
    private function continuesARun(Tokens $tokens, int $open): bool
    {
        $before = $open - 1;

        return $before > 0
            && $this->isLineBreak($tokens[$before])
            && $tokens[$before - 1]->isGivenKind(CT::T_ATTRIBUTE_CLOSE);
    }

    /**
     * Sorts the run of attribute groups that opens at the index, each on its own line, shortest first.
     */
    private function sortRunFrom(Tokens $tokens, int $start): void
    {
        $groups = [];
        $separators = [];
        $open = $start;

        while (true) {
            $close = $tokens->findBlockEnd(Tokens::BLOCK_TYPE_ATTRIBUTE, $open);
            $groups[] = $this->slice($tokens, $open, $close);

            if (! $this->isLineBreak($tokens[$close + 1] ?? new Token('')) || ! $tokens[$close + 2]->isGivenKind(T_ATTRIBUTE)) {
                break;
            }

            $separators[] = clone $tokens[$close + 1];
            $open = $close + 2;
        }

        $ordered = $groups;
        usort($ordered, fn (array $first, array $second): int => $this->lengthOf($first) <=> $this->lengthOf($second));

        if ($ordered === $groups) {
            return;
        }

        $replacement = [];

        foreach ($ordered as $position => $group) {
            array_push($replacement, ...$group);

            if (isset($separators[$position])) {
                $replacement[] = $separators[$position];
            }
        }

        $tokens->overrideRange($start, $close, $replacement);
    }

    /**
     * @return list<Token>
     */
    private function slice(Tokens $tokens, int $from, int $to): array
    {
        $slice = [];

        for ($index = $from; $index <= $to; $index++) {
            $slice[] = clone $tokens[$index];
        }

        return $slice;
    }

    /**
     * The group's length as one line, its line breaks and their indentation left out.
     *
     * @param  list<Token>  $group
     */
    private function lengthOf(array $group): int
    {
        $text = implode('', array_map(fn (Token $token) => $token->getContent(), $group));

        return strlen((string) preg_replace('/\s*\R\s*/', '', $text));
    }

    private function isLineBreak(Token $token): bool
    {
        return $token->isWhitespace() && str_contains($token->getContent(), "\n");
    }
}
